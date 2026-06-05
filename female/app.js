function isValidEnglishName(raw) { return /^[A-Za-z\s]+$/.test(raw.trim()) && raw.trim().length>0; }
    
    const DAILY_LIMIT = 50;
    
    function getTodayKey() {
        const today = new Date();
        return `query_count_${today.getFullYear()}_${today.getMonth()+1}_${today.getDate()}`;
    }
    
    function getTodayCount() {
        const key = getTodayKey();
        return parseInt(localStorage.getItem(key) || '0');
    }
    
    function incrementCount() {
        const key = getTodayKey();
        const count = getTodayCount();
        localStorage.setItem(key, String(count + 1));
        return count + 1;
    }
    
    function checkDailyLimit() {
        const count = getTodayCount();
        return count < DAILY_LIMIT;
    }
    
    function getRemainingCount() {
        return DAILY_LIMIT - getTodayCount();
    }
    
    async function callAIAPI(englishName) {
        console.log('callAIAPI called with:', englishName);
        
        if (!checkDailyLimit()) {
            throw new Error(`Daily limit exceeded. You can try again tomorrow.`);
        }
        
        const systemPrompt = `You are an expert in Chinese female naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "..."}]}
Rules: Provide 3 Chinese female names ONLY. The names MUST be feminine and suitable for women. NEVER provide male names. All characters must have feminine connotations. Return only JSON.`;
        const userMessage = `Generate 3 Chinese female names for "${englishName}". These must be feminine names suitable for women, not men.`;
        
        const requestBody = { 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ], 
            temperature: 0.75 
        };
        
        console.log('Fetching from /api/generate-name...');
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        try {
            const res = await fetch('/api/generate-name', {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
                timeout: 30000
            });
            
            console.log('API response status:', res.status);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('API error response:', errorText);
                throw new Error(`API ${res.status}: ${errorText}`);
            }
            
            const data = await res.json();
            console.log('API response received:', JSON.stringify(data, null, 2));
            
            const content = data?.choices?.[0]?.message?.content;
            if (!content) {
                console.error('Empty content in response');
                throw new Error("empty");
            }
            
            const match = content.match(/\{[\s\S]*\}/);
            if (!match) {
                console.error('No JSON match found in content:', content);
                throw new Error("no_json");
            }
            
            const parsed = JSON.parse(match[0]);
            if (!parsed.primary || !parsed.alternatives) throw new Error("incomplete");
            
            incrementCount();
            return { primary: parsed.primary, alternatives: parsed.alternatives.slice(0,2) };
            
        } catch (error) {
            console.error('callAIAPI error:', error.message);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('Network error - check if backend server is running');
            }
            throw error;
        }
    }

    async function callAIAPIForWuxing(birthYear, birthMonth, surname, styleType, zodiac, preferredElement, seasonElement) {
        if (!checkDailyLimit()) {
            throw new Error(`Daily limit exceeded. You can try again tomorrow.`);
        }
        
        const styleMap = {
            "single": "single character name (e.g., Li·Xuan)",
            "double": "double character name (e.g., Li·Mingxuan)",
            "reduplicate": "reduplicate name (e.g., Li·An'an)"
        };
        const styleDesc = styleMap[styleType] || "double character name";
        const systemPrompt = `You are an expert in Chinese Five Elements (Wuxing) naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide", "element": "Element name in English"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "...","element": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "...","element": "..."}]}
Rules: Based on birth year ${birthYear}, birth month ${birthMonth}, zodiac ${zodiac}, preferred element ${preferredElement}, season element ${seasonElement}, surname ${surname}, name style ${styleDesc}. Provide 3 Chinese female names ONLY. Names MUST be feminine and suitable for women. NEVER provide male names. Return only JSON.`;
        const userMessage = `Generate 3 Chinese female names for a person born in ${birthMonth}/${birthYear} (Zodiac: ${zodiac}, Preferred Element: ${preferredElement}). Surname: ${surname}. Name style: ${styleDesc}. These must be feminine names for women, not men.`;
        const res = await fetch('/api/wuxing-name', {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "system", content: systemPrompt },{ role: "user", content: userMessage }], temperature: 0.8 })
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error("empty");
        const match = content.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(match[0]);
        if (!parsed.primary || !parsed.alternatives) throw new Error("incomplete");
        
        incrementCount();
        return { primary: parsed.primary, alternatives: parsed.alternatives.slice(0,2) };
    }
    const offlineNameMap = {
        "emma": { primary: { chn:"艾玛",pinyin:"Āi Mǎ",meaning:"Universal and whole",pronunciation:"Eye Ma"}, alternatives:[{chn:"艾美",pinyin:"Ài Měi",meaning:"Lovely beauty",pronunciation:"Eye May"},{chn:"爱萌",pinyin:"Ài Méng",meaning:"Cute and lovable",pronunciation:"Eye Meng"}] },
        "olivia":{ primary:{chn:"奥利维亚",pinyin:"Ào Lì Wéi Yà",meaning:"Olive tree",pronunciation:"Oh-lee-vee-yah"}, alternatives:[{chn:"奥莉",pinyin:"Ào Lì",meaning:"Graceful olive",pronunciation:"Oh-lee"},{chn:"婉婷",pinyin:"Wǎn Tíng",meaning:"Elegant and graceful",pronunciation:"Wan Ting"}] },
        "sophia":{ primary:{chn:"索菲亚",pinyin:"Suǒ Fēi Yà",meaning:"Wisdom",pronunciation:"Soh-fee-yah"}, alternatives:[{chn:"苏菲",pinyin:"Sū Fēi",meaning:"Pure wisdom",pronunciation:"Soo-fee"},{chn:"思慧",pinyin:"Sī Huì",meaning:"Thoughtful wisdom",pronunciation:"See Hway"}] },
        "mia":{ primary:{chn:"米娅",pinyin:"Mǐ Yà",meaning:"Mine",pronunciation:"Mee-yah"}, alternatives:[{chn:"米雅",pinyin:"Mǐ Yǎ",meaning:"Elegant rice",pronunciation:"Mee-ya"},{chn:"妙雅",pinyin:"Miào Yǎ",meaning:"Wonderful elegance",pronunciation:"Myow-ya"}] },
        "ava":{ primary:{chn:"艾娃",pinyin:"Ài Wá",meaning:"Birdlike",pronunciation:"Eye-wah"}, alternatives:[{chn:"雅薇",pinyin:"Yǎ Wēi",meaning:"Elegant rose",pronunciation:"Ya-way"},{chn:"爱娃",pinyin:"Ài Wá",meaning:"Beloved child",pronunciation:"Eye-wah"}] }
    };
    function fallbackGenerate(name) {
        const key = name.trim().toLowerCase();
        if(offlineNameMap[key]) return offlineNameMap[key];
        return { primary: { chn:"钰婷",pinyin:"Yù Tíng",meaning:"Jade-like beauty",pronunciation:"Yoo Ting"}, alternatives:[{chn:"涵玥",pinyin:"Hán Yuè",meaning:"Gentle moonlight",pronunciation:"Hahn Yweh"},{chn:"婉婷",pinyin:"Wǎn Tíng",meaning:"Graceful elegance",pronunciation:"Wan Ting"}] };
    }
    async function generateChineseNames(en) { 
        try { 
            return await callAIAPI(en); 
        } catch(e) { 
            console.error('API call failed:', e.message);
            return fallbackGenerate(en); 
        } 
    }

    function renderEnglishDefault(englishName) {
        const container = document.getElementById("englishNameCards");
        const result = offlineNameMap[englishName.trim().toLowerCase()] || offlineNameMap["jack"];
        let html = `<div class="extra-info">Names for "${escapeHtml(englishName)}" (local database):</div>`;
        html += `<div class="name-card"><div class="badge">Recommended</div><div class="chinese-name">${escapeHtml(result.primary.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(result.primary.chn)}','${escapeHtml(result.primary.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(result.primary.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(result.primary.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(result.primary.pronunciation)}</div></div>`;
        for(let alt of result.alternatives) html += `<div class="name-card"><div class="badge">Alternative</div><div class="chinese-name">${escapeHtml(alt.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(alt.chn)}','${escapeHtml(alt.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(alt.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(alt.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(alt.pronunciation)}</div></div>`;
        container.innerHTML = html;
    }

    async function renderEnglishWithAI(englishName) {
        const container = document.getElementById("englishNameCards");
        if (!isValidEnglishName(englishName)) { 
            container.innerHTML = `<div class="error-msg">Please enter a valid English name</div>`; 
            return; 
        }
        container.innerHTML = `<div class="name-card"><div class="loading-text"><div class="loading-spinner"></div> Generating names...</div></div>`;
        try {
            console.log('Starting AI name generation for:', englishName);
            const result = await generateChineseNames(englishName);
            console.log('AI generation successful:', result);
            let html = `<div class="extra-info">Names for "${escapeHtml(englishName)}" (AI generated):</div>`;
            html += `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(result.primary.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(result.primary.chn)}','${escapeHtml(result.primary.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(result.primary.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(result.primary.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(result.primary.pronunciation)}</div></div>`;
            for(let alt of result.alternatives) html += `<div class="name-card"><div class="badge">Alternative</div><div class="chinese-name">${escapeHtml(alt.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(alt.chn)}','${escapeHtml(alt.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(alt.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(alt.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(alt.pronunciation)}</div></div>`;
            container.innerHTML = html;
        } catch(e) {
            console.error('AI generation failed:', e.message);
            container.innerHTML = `<div class="error-msg">Generation failed: ${escapeHtml(e.message)}. Showing local results instead.</div>`;
            setTimeout(() => renderEnglishDefault(englishName), 100);
        }
    }

    let currentAudio = null;
    function playAudio(chineseName, pinyin, btn) {
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(chineseName);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.7;
            utterance.onstart = () => btn.classList.add('playing');
            utterance.onend = () => btn.classList.remove('playing');
            utterance.onerror = () => btn.classList.remove('playing');
            speechSynthesis.speak(utterance);
            currentAudio = { pause: () => speechSynthesis.cancel() };
        }
    }

    function escapeHtml(str) { return String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
    
    const elementSingleChars = {
        "金": ["钰","铭","铃","锦","钗","钿","银","鑫"],
        "木": ["琳","杉","梅","桃","桂","柳","芸","芝"],
        "水": ["涵","汐","洁","滢","淳","渝","沐","清"],
        "火": ["婷","娜","煜","烁","灵","焕","熙","瑶"],
        "土": ["婉","怡","安","岚","娅","婉","恩","韵"]
    };
    const elementDoubleNames = {
        "金": ["钰婷","铭萱","铃兰","锦怡","银萍","鑫蕾","钰琪","铭雅"],
        "木": ["琳萱","梅婷","桂兰","柳清","芸熙","芝涵","杉妮","桃妍"],
        "水": ["涵玥","汐瑶","洁琳","滢萱","淳雅","渝婷","沐雪","清妍"],
        "火": ["婷怡","娜琳","煜婷","烁琪","灵萱","焕婷","熙雯","瑶琪"],
        "土": ["婉婷","怡萱","安琳","岚婷","娅琪","婉清","恩熙","韵涵"]
    };
    const reduplicateMap = {
        "金": ["铭铭","铃铃","鑫鑫","锦锦"],
        "木": ["琳琳","杉杉","梅梅","芸芸"],
        "水": ["涵涵","清清","滢滢","淳淳"],
        "火": ["婷婷","娜娜","熙熙","瑶瑶"],
        "土": ["婉婉","怡怡","安安","岚岚"]
    };
    
    const zodiacAnimals = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
    const zodiacElementMap = {"Rat":"Water","Ox":"Earth","Tiger":"Wood","Rabbit":"Wood","Dragon":"Earth","Snake":"Fire","Horse":"Fire","Goat":"Earth","Monkey":"Metal","Rooster":"Metal","Dog":"Earth","Pig":"Water"};
    const preferredElementMap = {"Rat":["Metal","Water"],"Ox":["Fire","Earth"],"Tiger":["Water","Wood"],"Rabbit":["Water","Wood"],"Dragon":["Fire","Earth"],"Snake":["Wood","Fire"],"Horse":["Wood","Fire"],"Goat":["Fire","Earth"],"Monkey":["Earth","Metal"],"Rooster":["Earth","Metal"],"Dog":["Fire","Earth"],"Pig":["Metal","Water"]};
    function getSeasonElement(month) { if (month>=3 && month<=5) return "Wood"; if (month>=6 && month<=8) return "Fire"; if (month>=9 && month<=11) return "Metal"; return "Water"; }
    function getZodiac(year) { return zodiacAnimals[(year - 1900) % 12]; }
    
    function getWuxingMainElement(year, month) {
        const zodiac = getZodiac(year);
        const prefer = preferredElementMap[zodiac] || ["Earth"];
        return prefer[0];
    }
    
    function getAnalysisText(year, month) {
        const zodiac = getZodiac(year);
        const zodiacElem = zodiacElementMap[zodiac];
        const seasonElem = getSeasonElement(month);
        const mainElem = getWuxingMainElement(year, month);
        return `Zodiac: ${zodiac} (${zodiacElem} element) | Season Element: ${seasonElem} | Preferred Element: ${mainElem}. Names have been selected based on this analysis.`;
    }
    
    function generateSingleName(surname, mainElement) {
        const chars = elementSingleChars[mainElement] || elementSingleChars["土"];
        const picked = chars[Math.floor(Math.random() * chars.length)];
        const full = surname + picked;
        const pinyinBase = `${pinyinSmart(surname)} ${pinyinSmart(picked)}`;
        return { name: full, pinyin: pinyinBase, meaning: `Single character name with ${mainElement} element. The character ${picked} symbolizes strength and simplicity.` };
    }
    
    function generateDoubleName(surname, mainElement) {
        const pairs = elementDoubleNames[mainElement] || elementDoubleNames["土"];
        const chosen = pairs[Math.floor(Math.random() * pairs.length)];
        const full = surname + chosen;
        const pinyinPart = pinyinSmart(chosen);
        return { name: full, pinyin: `${pinyinSmart(surname)} ${pinyinPart}`, meaning: `Classic double-character name with ${mainElement} element. Implies stability and auspicious prospects.` };
    }
    
    function generateReduplicateName(surname, mainElement) {
        const redupList = reduplicateMap[mainElement] || reduplicateMap["土"];
        const base = redupList[Math.floor(Math.random() * redupList.length)];
        const full = surname + base;
        const pinyinBase = pinyinSmart(base);
        return { name: full, pinyin: `${pinyinSmart(surname)} ${pinyinBase}`, meaning: `Reduplicate name with ${mainElement} element. Implies warmth, kindness, and harmonious relationships.` };
    }
    
    function pinyinSmart(str) {
        if(!str) return "";
        const map = {
            "李":"Lǐ","王":"Wáng","张":"Zhāng","刘":"Liú","陈":"Chén","欧阳":"Ōuyáng","司马":"Sīmǎ","上官":"Shàngguān","皇甫":"Huángfǔ","令狐":"Lìnghú","诸葛":"Zhūgě",
            "钰":"Yù","铭":"Míng","铃":"Líng","锦":"Jǐn","钗":"Chāi","钿":"Diàn","银":"Yín","鑫":"Xīn","琳":"Lín","杉":"Shān","梅":"Méi","桃":"Táo","桂":"Guì","柳":"Liǔ","芸":"Yún","芝":"Zhī","涵":"Hán","汐":"Xī","洁":"Jié","滢":"Yíng","淳":"Chún","渝":"Yú","沐":"Mù","清":"Qīng","婷":"Tíng","娜":"Nà","煜":"Yù","烁":"Shuò","灵":"Líng","焕":"Huàn","熙":"Xī","瑶":"Yáo","婉":"Wǎn","怡":"Yí","安":"Ān","岚":"Lán","娅":"Yà","恩":"Ēn","韵":"Yùn","萱":"Xuān","萍":"Píng","蕾":"Lěi","琪":"Qí","妮":"Nī","妍":"Yán","玥":"Yuè","雯":"Wén","铭铭":"Míng Míng","铃铃":"Líng Líng","鑫鑫":"Xīn Xīn","琳琳":"Lín Lín","杉杉":"Shān Shān","梅梅":"Méi Méi","芸芸":"Yún Yún","涵涵":"Hán Hán","清清":"Qīng Qīng","婷婷":"Tíng Tíng","娜娜":"Nà Nà","婉婉":"Wǎn Wǎn","怡怡":"Yí Yí","安安":"Ān Ān"
        };
        let result = "";
        for(let ch of str) {
            result += (map[ch] || ch) + " ";
        }
        return result.trim();
    }

    const meaningNameMap = {
        "moral": {
            "single": ["钰","铭","锦","涵","婉","怡","婷","娜","洁","雅","萱","琪","妍","岚","韵"],
            "double": ["钰婷","铭萱","锦怡","涵玥","婉清","怡婷","婷怡","娜琳","洁琳","雅琪","萱怡","琪涵","妍婷","岚雅","韵涵"],
            "reduplicate": ["婷婷","娜娜","涵涵","清清","雅雅","琪琪","婉婉","怡怡","萱萱","岚岚"]
        },
        "career": {
            "single": ["钰","铭","锦","涵","婷","娜","雅","琪","萱","琳","怡","婉","岚","韵","妍"],
            "double": ["钰婷","铭萱","锦怡","涵玥","婷怡","娜琳","雅琪","萱怡","琳萱","怡婷","婉婷","岚雅","韵涵","妍婷","琪涵"],
            "reduplicate": ["婷婷","娜娜","涵涵","雅雅","琪琪","萱萱","琳琳","怡怡","婉婉","岚岚"]
        },
        "health": {
            "single": ["涵","洁","清","沐","安","怡","婉","婷","娜","雅","琪","萱","琳","岚","韵"],
            "double": ["涵玥","洁琳","清妍","沐雪","安琳","怡婷","婉婷","婷怡","娜琳","雅琪","萱怡","琳萱","岚婷","韵涵","妍婷"],
            "reduplicate": ["安安","涵涵","清清","洁洁","怡怡","婉婉","婷婷","娜娜","雅雅","琪琪"]
        }
    };

    const meaningElements = {
        "moral": "金",
        "career": "木",
        "health": "水"
    };

    function generateMeaningName(surname, meaningType, styleType) {
        const nameList = meaningNameMap[meaningType][styleType] || meaningNameMap[meaningType]["single"];
        const chosen = nameList[Math.floor(Math.random() * nameList.length)];
        const full = surname + chosen;
        const styleDesc = styleType === "single" ? "single character" : styleType === "double" ? "double character" : "reduplicate";
        return { name: full, pinyin: `${pinyinSmart(surname)} ${pinyinSmart(chosen)}`, meaning: `Meaning-based ${styleDesc} name representing ${meaningType === 'moral' ? 'moral cultivation and virtue' : meaningType === 'career' ? 'career ambition and success' : 'health and safety'}. The character ${chosen} embodies positive qualities.` };
    }

    function renderMeaningDefault(surname, meaningType, styleType) {
        const container = document.getElementById("meaningNameCards");
        if (!surname) { container.innerHTML = `<div class="name-card">Please select a surname</div>`; return; }
        const meaningLabels = { "moral": "Moral Cultivation", "career": "Career & Ambition", "health": "Health & Safety" };
        const label = meaningLabels[meaningType] || "Meaning";
        const styleDesc = styleType === "single" ? "Single Character" : styleType === "double" ? "Double Character" : "Reduplicate";
        let html = `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(surname)}<button class="audio-btn" onclick="playAudio('${escapeHtml(surname)}','${escapeHtml(pinyinSmart(surname))}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(pinyinSmart(surname))}</div><div class="meaning">Surname: ${escapeHtml(surname)} — ${styleDesc} names for ${label}</div></div>`;
        for (let i = 0; i < 3; i++) {
            const nameObj = generateMeaningName(surname, meaningType, styleType);
            html += `<div class="name-card"><div class="badge">${i === 0 ? 'Option 1' : i === 1 ? 'Option 2' : 'Option 3'}</div><div class="chinese-name">${escapeHtml(nameObj.name)}<button class="audio-btn" onclick="playAudio('${escapeHtml(nameObj.name)}','${escapeHtml(nameObj.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(nameObj.pinyin)}</div><div class="meaning">${escapeHtml(nameObj.meaning)}</div></div>`;
        }
        container.innerHTML = html;
    }

    function renderMeaningWithAI(surname, meaningType, styleType) {
        const container = document.getElementById("meaningNameCards");
        const meaningLabels = { "moral": "moral cultivation and virtue", "career": "career ambition and success", "health": "health and safety" };
        const label = meaningLabels[meaningType] || "positive meaning";
        const styleDesc = styleType === "single" ? "single character" : styleType === "double" ? "double character" : "reduplicate";
        container.innerHTML = `
            <div class="name-card">
                <div class="loading-text"><div class="loading-spinner"></div> Generating ${styleDesc} names based on ${label}...</div>
                <div class="analysis-steps" style="margin-top:12px;font-size:0.85rem;color:#5a4a3a;">
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">⏳</span>
                        <span class="step-text">Analyzing surname: ${surname}</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">⏳</span>
                        <span class="step-text">Category selected: ${label}</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">⏳</span>
                        <span class="step-text">Style selected: ${styleDesc}</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">⏳</span>
                        <span class="step-text">Generating meaningful Chinese names...</span>
                    </div>
                </div>
                <div class="progress-bar" style="margin-top:12px;height:4px;background:#e2cfb5;border-radius:2px;overflow:hidden;">
                    <div class="progress-fill" style="height:100%;background:#c28142;width:30%;animation:progressPulse 1.5s ease-in-out infinite;"></div>
                </div>
            </div>`;
        callMeaningAPI(surname, meaningType, styleType).then(result => {
            let html = `<div class="extra-info">Generated ${styleDesc} names based on ${label} for "${escapeHtml(surname)}" family:</div>`;
            html += `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(result.primary.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(result.primary.chn)}','${escapeHtml(result.primary.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(result.primary.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(result.primary.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(result.primary.pronunciation)}</div></div>`;
            for (let alt of result.alternatives) {
                html += `<div class="name-card"><div class="badge">Alternative</div><div class="chinese-name">${escapeHtml(alt.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(alt.chn)}','${escapeHtml(alt.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(alt.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(alt.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(alt.pronunciation)}</div></div>`;
            }
            container.innerHTML = html;
        }).catch(e => {
            container.innerHTML = `<div class="error-msg">Generation failed, showing local results</div>`;
            setTimeout(() => renderMeaningDefault(surname, meaningType, styleType), 100);
        });
    }

    async function callMeaningAPI(surname, meaningType, styleType) {
        if (!checkDailyLimit()) {
            throw new Error(`Daily limit exceeded. You can try again tomorrow.`);
        }
        
        const meaningLabels = { "moral": "moral cultivation and virtue", "career": "career ambition and success", "health": "health and safety" };
        const label = meaningLabels[meaningType] || "positive meaning";
        const styleDesc = styleType === "single" ? "single character" : styleType === "double" ? "double character" : "reduplicate";
        const systemPrompt = `You are an expert in Chinese female naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "..."}]}
Rules: Based on surname "${surname}" and meaning category "${label}" and style "${styleDesc}", provide 3 Chinese female names ONLY. Names MUST be feminine and suitable for women. NEVER provide male names. The names must represent ${label}. Return only JSON.`;
        const userMessage = `Generate 3 Chinese female names for surname "${surname}" with meaning category: ${label} and style: ${styleDesc}. These must be feminine names for women, not men.`;
        const res = await fetch('/api/meaning-name', {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "system", content: systemPrompt },{ role: "user", content: userMessage }], temperature: 0.8 })
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error("empty");
        const match = content.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(match[0]);
        if (!parsed.primary || !parsed.alternatives) throw new Error("incomplete");
        
        incrementCount();
        return { primary: parsed.primary, alternatives: parsed.alternatives.slice(0, 2) };
    }
    
    function renderWuxingDefault(year, month, surname, styleType) {
        const container = document.getElementById("wuxingNameCards");
        const analysisDiv = document.getElementById("wuxingAnalysis");
        
        const mainElem = year && month ? getWuxingMainElement(year, month) : "Wood";
        const analysisText = year && month ? getAnalysisText(year, month) : "Please select a birth date for personalized Five Elements analysis.";
        
        let finalSurname = surname.trim();
        if (finalSurname === "") finalSurname = "Li";

        let html = "";
        if (styleType === "double") {
            html = `<div class="name-card">
                <div class="badge rec-badge">Recommended</div>
                <div class="chinese-name">李钰婷<span class="audio-btn" onclick="playAudio('李钰婷','Li Yuting',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Yùtíng</div>
                <div class="meaning">Jade-like beauty, elegant and graceful</div>
                <div class="pronunciation">Pronunciation: Lee Yoo-ting</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李涵玥<span class="audio-btn" onclick="playAudio('李涵玥','Li Hanyue',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Hányuè</div>
                <div class="meaning">Gentle and pure like moonlight</div>
                <div class="pronunciation">Pronunciation: Lee Hahn-yweh</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李婉婷<span class="audio-btn" onclick="playAudio('李婉婷','Li Wanting',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Wǎntíng</div>
                <div class="meaning">Graceful and elegant, gentle character</div>
                <div class="pronunciation">Pronunciation: Lee Wan-ting</div>
            </div>`;
        } else if (styleType === "reduplicate") {
            html = `<div class="name-card">
                <div class="badge rec-badge">Recommended</div>
                <div class="chinese-name">李婷婷<span class="audio-btn" onclick="playAudio('李婷婷','Li Tingting',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Tíngtíng</div>
                <div class="meaning">Graceful and elegant, beautiful appearance</div>
                <div class="pronunciation">Pronunciation: Lee Ting-ting</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李涵涵<span class="audio-btn" onclick="playAudio('李涵涵','Li Hanhan',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Hánhán</div>
                <div class="meaning">Gentle and virtuous, deep and thoughtful</div>
                <div class="pronunciation">Pronunciation: Lee Hahn-hahn</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李萱萱<span class="audio-btn" onclick="playAudio('李萱萱','Li Xuanxuan',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Xuānxuān</div>
                <div class="meaning">Beautiful like flowers, elegant and graceful</div>
                <div class="pronunciation">Pronunciation: Lee Shwen-shwen</div>
            </div>`;
        } else {
            html = `<div class="name-card">
                <div class="badge rec-badge">Recommended</div>
                <div class="chinese-name">李婷<span class="audio-btn" onclick="playAudio('李婷','Li Ting',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Tíng</div>
                <div class="meaning">Fire Element - Elegant and graceful</div>
                <div class="pronunciation">Pronunciation: Lee Ting</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李涵<span class="audio-btn" onclick="playAudio('李涵','Li Han',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Hán</div>
                <div class="meaning">Water Element - Gentle and virtuous</div>
                <div class="pronunciation">Pronunciation: Lee Hahn</div>
            </div>
            <div class="name-card">
                <div class="badge">Alternative</div>
                <div class="chinese-name">李琳<span class="audio-btn" onclick="playAudio('李琳','Li Lin',this)"><span class="audio-icon">🔊</span></span></div>
                <div class="pinyin">Lǐ Lín</div>
                <div class="meaning">Wood Element - Precious jade-like beauty</div>
                <div class="pronunciation">Pronunciation: Lee Lin</div>
            </div>`;
        }
        container.innerHTML = html;
        analysisDiv.innerHTML = `Analysis: ${analysisText}`;
        
        if (year && month) {
            let nameObj = null;
            if (styleType === "single") {
                nameObj = generateSingleName(finalSurname, mainElem);
            } else if (styleType === "double") {
                nameObj = generateDoubleName(finalSurname, mainElem);
            } else if (styleType === "reduplicate") {
                nameObj = generateReduplicateName(finalSurname, mainElem);
            } else {
                nameObj = generateDoubleName(finalSurname, mainElem);
            }
            html = `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(nameObj.name)}<button class="audio-btn" onclick="playAudio('${escapeHtml(nameObj.name)}','${escapeHtml(nameObj.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(nameObj.pinyin)}</div><div class="meaning">${escapeHtml(nameObj.meaning)}</div></div>`;
            let extra1, extra2;
            if (styleType === "single") {
                extra1 = generateSingleName(finalSurname, mainElem);
                extra2 = generateSingleName(finalSurname, mainElem);
            } else if (styleType === "double") {
                extra1 = generateDoubleName(finalSurname, mainElem);
                extra2 = generateDoubleName(finalSurname, mainElem);
            } else {
                extra1 = generateReduplicateName(finalSurname, mainElem);
                extra2 = generateReduplicateName(finalSurname, mainElem);
            }
            html += `<div class="name-card"><div class="badge">Same Style Option</div><div class="chinese-name">${escapeHtml(extra1.name)}<button class="audio-btn" onclick="playAudio('${escapeHtml(extra1.name)}','${escapeHtml(extra1.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(extra1.pinyin)}</div><div class="meaning">${escapeHtml(extra1.meaning)}</div></div>`;
            html += `<div class="name-card"><div class="badge">Another Great Name</div><div class="chinese-name">${escapeHtml(extra2.name)}<button class="audio-btn" onclick="playAudio('${escapeHtml(extra2.name)}','${escapeHtml(extra2.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(extra2.pinyin)}</div><div class="meaning">${escapeHtml(extra2.meaning)}</div></div>`;
            container.innerHTML = html;
        }
    }

    async function renderWuxingWithAI(year, month, surname, styleType) {
        const container = document.getElementById("wuxingNameCards");
        const analysisDiv = document.getElementById("wuxingAnalysis");
        
        const zodiac = year ? getZodiac(year) : "Rabbit";
        const zodiacElem = year ? zodiacElementMap[zodiac] : "Wood";
        const seasonElem = month ? getSeasonElement(month) : "Wood";
        const mainElem = year && month ? getWuxingMainElement(year, month) : "Wood";
        const analysisText = year && month ? getAnalysisText(year, month) : "Please select a birth date for personalized Five Elements analysis.";
        
        let finalSurname = surname.trim();
        if (finalSurname === "") finalSurname = "Li";

        if (!year || !month) {
            let html = "";
            if (styleType === "double") {
                html = `<div class="name-card">
                    <div class="badge rec-badge">Recommended</div>
                    <div class="chinese-name">李明轩<span class="audio-btn" onclick="playAudio('李明轩','Li Mingxuan',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Míngxuān</div>
                    <div class="meaning">Bright and elegant, with aspirations for wisdom</div>
                    <div class="pronunciation">Pronunciation: Lee Ming-shwen</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李浩宇<span class="audio-btn" onclick="playAudio('李浩宇','Li Haoyu',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Hàoyǔ</div>
                    <div class="meaning">Vast universe, broad-minded and ambitious</div>
                    <div class="pronunciation">Pronunciation: Lee How-yu</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李俊杰<span class="audio-btn" onclick="playAudio('李俊杰','Li Junjie',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Jùnjié</div>
                    <div class="meaning">Outstanding talent, noble character</div>
                    <div class="pronunciation">Pronunciation: Lee Jwen-jyeh</div>
                </div>`;
            } else if (styleType === "reduplicate") {
                html = `<div class="name-card">
                    <div class="badge rec-badge">Recommended</div>
                    <div class="chinese-name">李安安<span class="audio-btn" onclick="playAudio('李安安','Li Anan',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Ān'ān</div>
                    <div class="meaning">Peaceful and tranquil, safe and sound</div>
                    <div class="pronunciation">Pronunciation: Lee An-an</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李乐乐<span class="audio-btn" onclick="playAudio('李乐乐','Li Lele',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Lèlè</div>
                    <div class="meaning">Joyful and happy, full of laughter</div>
                    <div class="pronunciation">Pronunciation: Lee Leh-leh</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李轩轩<span class="audio-btn" onclick="playAudio('李轩轩','Li Xuanxuan',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Xuānxuān</div>
                    <div class="meaning">Elegant and graceful, refined character</div>
                    <div class="pronunciation">Pronunciation: Lee Shwen-shwen</div>
                </div>`;
            } else {
                html = `<div class="name-card">
                    <div class="badge rec-badge">Recommended</div>
                    <div class="chinese-name">李轩<span class="audio-btn" onclick="playAudio('李轩','Li Xuan',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Xuān</div>
                    <div class="meaning">Wood Element - Elegant and refined</div>
                    <div class="pronunciation">Pronunciation: Lee Shwen</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李浩<span class="audio-btn" onclick="playAudio('李浩','Li Hao',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Hào</div>
                    <div class="meaning">Water Element - Vast and profound</div>
                    <div class="pronunciation">Pronunciation: Lee How</div>
                </div>
                <div class="name-card">
                    <div class="badge">Alternative</div>
                    <div class="chinese-name">李俊<span class="audio-btn" onclick="playAudio('李俊','Li Jun',this)"><span class="audio-icon">🔊</span></span></div>
                    <div class="pinyin">Lǐ Jùn</div>
                    <div class="meaning">Fire Element - Talented and outstanding</div>
                    <div class="pronunciation">Pronunciation: Lee Jwen</div>
                </div>`;
            }
            container.innerHTML = html;
            analysisDiv.innerHTML = `Analysis: ${analysisText}`;
            return;
        }

        container.innerHTML = `
            <div class="name-card">
                <div class="loading-text"><div class="loading-spinner"></div> Analyzing Five Elements and generating names...</div>
                <div class="analysis-steps" style="margin-top:12px;font-size:0.85rem;color:#5a4a3a;">
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">🌙</span>
                        <span class="step-text">Zodiac: ${zodiac} (${zodiacElem})</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">🌿</span>
                        <span class="step-text">Season Element: ${seasonElem}</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">✨</span>
                        <span class="step-text">Preferred Element: ${mainElem}</span>
                    </div>
                    <div class="step" style="margin:6px 0;padding-left:20px;position:relative;">
                        <span class="step-icon" style="position:absolute;left:0;">🔮</span>
                        <span class="step-text">Generating balanced names...</span>
                    </div>
                </div>
                <div class="progress-bar" style="margin-top:12px;height:4px;background:#e2cfb5;border-radius:2px;overflow:hidden;">
                    <div class="progress-fill" style="height:100%;background:#c28142;width:30%;animation:progressPulse 1.5s ease-in-out infinite;"></div>
                </div>
            </div>`;

        callAIAPIForWuxing(year, month, finalSurname, styleType, zodiac, mainElem, seasonElem).then(result => {
            analysisDiv.innerHTML = `Analysis: ${analysisText}`;
            let html = `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(result.primary.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(result.primary.chn)}','${escapeHtml(result.primary.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(result.primary.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(result.primary.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(result.primary.pronunciation)}</div><div class="pronunciation">Element: ${escapeHtml(result.primary.element)} (${getElementChinese(result.primary.element)})</div></div>`;
            for (let alt of result.alternatives) {
                html += `<div class="name-card"><div class="badge">Alternative</div><div class="chinese-name">${escapeHtml(alt.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(alt.chn)}','${escapeHtml(alt.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(alt.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(alt.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(alt.pronunciation)}</div><div class="pronunciation">Element: ${escapeHtml(alt.element)} (${getElementChinese(alt.element)})</div></div>`;
            }
            container.innerHTML = html;
        }).catch(e => {
            container.innerHTML = `<div class="error-msg">Generation failed, showing local results</div>`;
            setTimeout(() => renderWuxingDefault(year, month, finalSurname, styleType), 100);
            analysisDiv.innerHTML = `Analysis: ${analysisText}`;
        });
    }

    function getElementChinese(elem) {
        const map = {"Wood":"木","Fire":"火","Earth":"土","Metal":"金","Water":"水"};
        return map[elem] || elem;
    }

    document.addEventListener('DOMContentLoaded', function() {
        const birthYearSelect = document.getElementById('birthYear');
        const birthMonthSelect = document.getElementById('birthMonth');
        const currentYear = new Date().getFullYear();
        
        birthYearSelect.innerHTML = '<option value="">Select Year</option>';
        for (let y = currentYear; y >= 1950; y--) {
            birthYearSelect.innerHTML += `<option value="${y}">${y}</option>`;
        }
        
        birthMonthSelect.innerHTML = '<option value="">Select Month</option>';
        for (let m = 1; m <= 12; m++) {
            birthMonthSelect.innerHTML += `<option value="${m}">${m}</option>`;
        }

        const modeBtns = document.querySelectorAll('.mode-btn');
        const panels = {
            'wuxing': document.getElementById('wuxingModePanel'),
            'meaning': document.getElementById('meaningModePanel'),
            'english': document.getElementById('englishModePanel')
        };

        modeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const mode = this.dataset.mode;
                Object.keys(panels).forEach(p => panels[p].style.display = p === mode ? 'block' : 'none');
                
                if (mode === 'english') {
                    const input = document.getElementById('englishNameInput');
                    if (input.value.trim()) {
                        renderEnglishDefault(input.value.trim());
                    }
                } else if (mode === 'meaning') {
                    const surname = document.querySelector('#meaningSurnameGroup .style-radio.selected')?.dataset.meaningsurname || '李';
                    const meaningType = document.querySelector('#meaningCategoryGroup .style-radio.selected')?.dataset.meaning || 'moral';
                    const styleType = document.querySelector('#meaningStyleGroup .style-radio.selected')?.dataset.meaningstyle || 'single';
                    renderMeaningDefault(surname, meaningType, styleType);
                } else if (mode === 'wuxing') {
                    const year = document.getElementById('birthYear').value;
                    const month = document.getElementById('birthMonth').value;
                    const surname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
                    const styleType = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
                    renderWuxingDefault(year, month, surname, styleType);
                }
            });
        });

        document.querySelectorAll('#surnameGroup .style-radio').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('#surnameGroup .style-radio').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                const year = document.getElementById('birthYear').value;
                const month = document.getElementById('birthMonth').value;
                const surname = this.dataset.surname;
                const styleType = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
                renderWuxingDefault(year, month, surname, styleType);
            });
        });

        document.querySelectorAll('#nameStyleGroup .style-radio').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('#nameStyleGroup .style-radio').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                const year = document.getElementById('birthYear').value;
                const month = document.getElementById('birthMonth').value;
                const surname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
                const styleType = this.dataset.style;
                renderWuxingDefault(year, month, surname, styleType);
            });
        });

        document.querySelectorAll('#meaningSurnameGroup .style-radio').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('#meaningSurnameGroup .style-radio').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                const surname = this.dataset.meaningsurname;
                const meaningType = document.querySelector('#meaningCategoryGroup .style-radio.selected')?.dataset.meaning || 'moral';
                const styleType = document.querySelector('#meaningStyleGroup .style-radio.selected')?.dataset.meaningstyle || 'single';
                renderMeaningDefault(surname, meaningType, styleType);
            });
        });

        document.querySelectorAll('#meaningCategoryGroup .style-radio').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('#meaningCategoryGroup .style-radio').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                const surname = document.querySelector('#meaningSurnameGroup .style-radio.selected')?.dataset.meaningsurname || '李';
                const meaningType = this.dataset.meaning;
                const styleType = document.querySelector('#meaningStyleGroup .style-radio.selected')?.dataset.meaningstyle || 'single';
                renderMeaningDefault(surname, meaningType, styleType);
            });
        });

        document.querySelectorAll('#meaningStyleGroup .style-radio').forEach(el => {
            el.addEventListener('click', function() {
                document.querySelectorAll('#meaningStyleGroup .style-radio').forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                const surname = document.querySelector('#meaningSurnameGroup .style-radio.selected')?.dataset.meaningsurname || '李';
                const meaningType = document.querySelector('#meaningCategoryGroup .style-radio.selected')?.dataset.meaning || 'moral';
                const styleType = this.dataset.meaningstyle;
                renderMeaningDefault(surname, meaningType, styleType);
            });
        });

        document.getElementById('genWuxingBtn').addEventListener('click', function() {
            const year = document.getElementById('birthYear').value;
            const month = document.getElementById('birthMonth').value;
            const surname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
            const styleType = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
            
            if (!year || !month) {
                alert('Please select birth year and month!');
                return;
            }
            
            renderWuxingWithAI(year, month, surname, styleType);
        });

        document.getElementById('genMeaningBtn').addEventListener('click', function() {
            const surname = document.querySelector('#meaningSurnameGroup .style-radio.selected')?.dataset.meaningsurname || '李';
            const meaningType = document.querySelector('#meaningCategoryGroup .style-radio.selected')?.dataset.meaning || 'moral';
            const styleType = document.querySelector('#meaningStyleGroup .style-radio.selected')?.dataset.meaningstyle || 'single';
            renderMeaningWithAI(surname, meaningType, styleType);
        });

        document.getElementById('genEnglishBtn').addEventListener('click', function() {
            const name = document.getElementById('englishNameInput').value;
            renderEnglishWithAI(name);
        });

        document.getElementById('englishNameInput').addEventListener('input', function() {
            const value = this.value.trim();
            if (value) {
                renderEnglishDefault(value);
            }
        });

        document.getElementById('birthYear').addEventListener('change', function() {
            const year = this.value;
            const month = document.getElementById('birthMonth').value;
            const surname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
            const styleType = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
            renderWuxingDefault(year, month, surname, styleType);
        });

        document.getElementById('birthMonth').addEventListener('change', function() {
            const year = document.getElementById('birthYear').value;
            const month = this.value;
            const surname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
            const styleType = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
            renderWuxingDefault(year, month, surname, styleType);
        });

        const englishInput = document.getElementById('englishNameInput');
        if (englishInput.value.trim()) {
            renderEnglishDefault(englishInput.value.trim());
        }

        const defaultSurname = document.querySelector('#surnameGroup .style-radio.selected')?.dataset.surname || '李';
        const defaultStyle = document.querySelector('#nameStyleGroup .style-radio.selected')?.dataset.style || 'single';
        renderWuxingDefault('', '', defaultSurname, defaultStyle);

        const meaningSurname = document.querySelector('#meaningSurnameGroup .style-radio.selected')?.dataset.meaningsurname || '李';
        const meaningType = document.querySelector('#meaningCategoryGroup .style-radio.selected')?.dataset.meaning || 'moral';
        const meaningStyle = document.querySelector('#meaningStyleGroup .style-radio.selected')?.dataset.meaningstyle || 'single';
        renderMeaningDefault(meaningSurname, meaningType, meaningStyle);
    });