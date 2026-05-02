const DAILY_LIMIT = 5;
    const STORAGE_KEY = "cn_name_generator_date";
    const COUNT_KEY = "cn_name_generator_count";

    function getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    }

    function checkDailyLimit() {
        const today = getTodayKey();
        const storedDate = localStorage.getItem(STORAGE_KEY);
        if (storedDate !== today) {
            localStorage.setItem(STORAGE_KEY, today);
            localStorage.setItem(COUNT_KEY, "0");
        }
        const count = parseInt(localStorage.getItem(COUNT_KEY) || "0");
        return count < DAILY_LIMIT;
    }

    function incrementCount() {
        const count = parseInt(localStorage.getItem(COUNT_KEY) || "0");
        localStorage.setItem(COUNT_KEY, String(count + 1));
    }

    function isValidEnglishName(raw) { return /^[A-Za-z\s]+$/.test(raw.trim()) && raw.trim().length>0; }
    async function callAIAPI(englishName) {
        if (!checkDailyLimit()) {
            throw new Error("DAILY_LIMIT_REACHED");
        }
        const systemPrompt = `You are an expert in Chinese male naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "..."}]}
Rules: Provide 3 Chinese male names ONLY. The names MUST be masculine and suitable for men. NEVER provide female names. All characters must have masculine connotations. Return only JSON.`;
        const userMessage = `Generate 3 Chinese male names for "${englishName}". These must be masculine names suitable for men, not women.`;
        const res = await fetch('/api/generate-name', {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "system", content: systemPrompt },{ role: "user", content: userMessage }], temperature: 0.75 })
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

    async function callAIAPIForWuxing(birthYear, birthMonth, surname, styleType, zodiac, preferredElement, seasonElement) {
        if (!checkDailyLimit()) {
            throw new Error("DAILY_LIMIT_REACHED");
        }
        const styleMap = {
            "single": "single character name (e.g., Li·Xuan)",
            "double": "double character name (e.g., Li·Mingxuan)",
            "reduplicate": "reduplicate name (e.g., Li·An'an)"
        };
        const styleDesc = styleMap[styleType] || "double character name";
        const systemPrompt = `You are an expert in Chinese Five Elements (Wuxing) naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide", "element": "Element name in English"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "...","element": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "...","element": "..."}]}
Rules: Based on birth year ${birthYear}, birth month ${birthMonth}, zodiac ${zodiac}, preferred element ${preferredElement}, season element ${seasonElement}, surname ${surname}, name style ${styleDesc}. Provide 3 Chinese male names ONLY. Names MUST be masculine and suitable for men. NEVER provide female names. Return only JSON.`;
        const userMessage = `Generate 3 Chinese male names for a person born in ${birthMonth}/${birthYear} (Zodiac: ${zodiac}, Preferred Element: ${preferredElement}). Surname: ${surname}. Name style: ${styleDesc}. These must be masculine names for men, not women.`;
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
        return { primary: parsed.primary, alternatives: parsed.alternatives.slice(0,2) };
    }
    const offlineNameMap = {
        "jack": { primary: { chn:"杰克",pinyin:"Jié Kè",meaning:"Classic heroic knight",pronunciation:"Jee-eh KUH"}, alternatives:[{chn:"杰凯",pinyin:"Jié Kǎi",meaning:"Victorious champion",pronunciation:"Jee-eh KAI"},{chn:"杰瑞",pinyin:"Jié Ruì",meaning:"Auspicious talent",pronunciation:"Jee-eh Ray"}] },
        "michael":{ primary:{chn:"迈克尔",pinyin:"Mài Kè Ěr",meaning:"Gift from God",pronunciation:"My-kehl"}, alternatives:[{chn:"米高",pinyin:"Mǐ Gāo",meaning:"Lofty ambition",pronunciation:"Mee-Gow"},{chn:"铭凯",pinyin:"Míng Kǎi",meaning:"Triumphant scholar",pronunciation:"Ming-Kai"}] },
        "william":{ primary:{chn:"威廉",pinyin:"Wēi Lián",meaning:"Resolute protector",pronunciation:"Way-lee-ahn"}, alternatives:[{chn:"维安",pinyin:"Wéi Ān",meaning:"Peace guardian",pronunciation:"Way-An"},{chn:"文翰",pinyin:"Wén Hàn",meaning:"Scholarly gentleman",pronunciation:"Wun-Hahn"}] },
        "elijah":{ primary:{chn:"以利亚",pinyin:"Yǐ Lì Yà",meaning:"Strength of prophet",pronunciation:"Yee-lee-yah"}, alternatives:[{chn:"奕辰",pinyin:"Yì Chén",meaning:"Brilliant star",pronunciation:"Ee-chen"},{chn:"伊莱贾",pinyin:"Yī Lái Jiǎ",meaning:"Spiritual warrior",pronunciation:"Ee-lai-jyah"}] },
        "leo":{ primary:{chn:"利奥",pinyin:"Lì Ào",meaning:"Lionhearted courage",pronunciation:"Lee-ow"}, alternatives:[{chn:"立昂",pinyin:"Lì Áng",meaning:"Pride and strength",pronunciation:"Lee-ahng"},{chn:"莱恩",pinyin:"Lái Ēn",meaning:"Graceful lion",pronunciation:"Lai-en"}] }
    };
    function fallbackGenerate(name) {
        const key = name.trim().toLowerCase();
        if(offlineNameMap[key]) return offlineNameMap[key];
        return { primary: { chn:"瑞铭",pinyin:"Ruì Míng",meaning:"Wise and noble",pronunciation:"Ray Ming"}, alternatives:[{chn:"瑞安",pinyin:"Ruì Ān",meaning:"Tranquil wisdom",pronunciation:"Ray An"},{chn:"铭泽",pinyin:"Míng Zé",meaning:"Kind and brilliant",pronunciation:"Ming Zuh"}] };
    }
    async function generateChineseNames(en) { try { return await callAIAPI(en); } catch(e) { return fallbackGenerate(en); } }

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
        if (!isValidEnglishName(englishName)) { container.innerHTML = `<div class="error-msg">Please enter a valid English name</div>`; return; }
        if (!checkDailyLimit()) {
            container.innerHTML = `<div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div>`;
            return;
        }
        container.innerHTML = `<div class="name-card"><div class="loading-text"><div class="loading-spinner"></div> Generating names...</div></div>`;
        try {
            const result = await generateChineseNames(englishName);
            let html = `<div class="extra-info">Names for "${escapeHtml(englishName)}":</div>`;
            html += `<div class="name-card"><div class="badge rec-badge">Recommended</div><div class="chinese-name">${escapeHtml(result.primary.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(result.primary.chn)}','${escapeHtml(result.primary.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(result.primary.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(result.primary.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(result.primary.pronunciation)}</div></div>`;
            for(let alt of result.alternatives) html += `<div class="name-card"><div class="badge">Alternative</div><div class="chinese-name">${escapeHtml(alt.chn)}<button class="audio-btn" onclick="playAudio('${escapeHtml(alt.chn)}','${escapeHtml(alt.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div><div class="pinyin">${escapeHtml(alt.pinyin)}</div><div class="meaning">Meaning: ${escapeHtml(alt.meaning)}</div><div class="pronunciation">Pronunciation: ${escapeHtml(alt.pronunciation)}</div></div>`;
            container.innerHTML = html;
        } catch(e) {
            if (e.message === "DAILY_LIMIT_REACHED") {
                container.innerHTML = `<div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div>`;
            } else {
                container.innerHTML = `<div class="error-msg">Generation failed, please try again</div>`;
            }
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
        "金": ["瑞","铭","锐","钧","锦","锋","银","铮"],
        "木": ["梓","林","柏","森","桐","栋","楷","松"],
        "水": ["浩","泽","鸿","瀚","润","沐","清","滔"],
        "火": ["炎","煜","旭","昂","昊","昱","烁","炜"],
        "土": ["圣","峻","宇","安","维","辰","坤","磊"]
    };
    const elementDoubleNames = {
        "金": ["瑞铭","锐泽","锦程","铭凯","钧瀚","锋锐"],
        "木": ["梓轩","林栩","柏豪","森荣","栋梁","楷瑞"],
        "水": ["浩宇","泽洋","鸿涛","润泽","清源","沐轩"],
        "火": ["炎彬","旭尧","煜城","昊然","昱辉","炜宸"],
        "土": ["圣哲","峻峰","宇轩","安辰","维远","坤舆"]
    };
    const reduplicateMap = {
        "金": ["铭铭","瑞瑞","钧钧","铮铮"],
        "木": ["林林","森森","彬彬","松松"],
        "水": ["浩浩","泽泽","源源","清清"],
        "火": ["炎炎","灿灿","炜炜","昱昱"],
        "土": ["安安","辰辰","维维","坤坤"]
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
            "瑞":"Ruì","铭":"Míng","锐":"Ruì","泽":"Zé","锦":"Jǐn","轩":"Xuān","林":"Lín","柏":"Bǎi","森":"Sēn","浩":"Hào","宇":"Yǔ","鸿":"Hóng","炎":"Yán","旭":"Xù","煜":"Yù","圣":"Shèng","峻":"Jùn","安":"Ān","辰":"Chén","坤":"Kūn","铮":"Zhēng","钧":"Jūn","锋":"Fēng","银":"Yín","梓":"Zǐ","桐":"Tóng","栋":"Dòng","楷":"Kǎi","松":"Sōng","泽":"Zé","瀚":"Hàn","润":"Rùn","沐":"Mù","清":"Qīng","滔":"Tāo","彬":"Bīn","尧":"Yáo","城":"Chéng","昊":"Hào","昱":"Yù","炜":"Wěi","宸":"Chén","哲":"Zhé","峰":"Fēng","维":"Wéi","远":"Yuǎn","坤":"Kūn","铭铭":"Míng Míng","瑞瑞":"Ruì Ruì","浩浩":"Hào Hào"
        };
        let result = "";
        for(let ch of str) {
            result += (map[ch] || ch) + " ";
        }
        return result.trim();
    }

    const meaningNameMap = {
        "moral": {
            "single": ["瑞","铭","锐","泽","锦","钧","锋","圣","峻","安","辰","坤","昊","炜","耀"],
            "double": ["瑞铭","锐泽","锦程","钧瀚","锋锐","铭凯","钧平","锐志","圣哲","峻峰","宇轩","安和","辰康","坤舆","哲宇","耀明"],
            "reduplicate": ["安安","瑞瑞","铭铭","泽泽","平平","明明","光光","康康","宁宁","和和"]
        },
        "career": {
            "single": ["铭","锐","泽","锦","钧","锋","志","豪","荣","栋","楷","松","桐","浩","鸿","炎","旭","煜","昱","炜","圣","峻","安","辰","坤","昊","耀"],
            "double": ["铭凯","锐泽","锦程","钧瀚","锋锐","瑞安","铭志","锐进","梓轩","林栩","栋梁","森荣","楷瑞","松云","桐林","榕城","浩宇","泽洋","鸿涛","润泽","炎彬","旭尧","煜城","昊然","昱辉","炜宸","熠辉","耀鹏","圣哲","峻峰","宇轩","安辰","坤舆","哲宇"],
            "reduplicate": ["安安","志志","豪豪","荣荣","栋栋","楷楷","松松","桐桐","浩浩","鸿鸿","旭旭","明明","耀耀","程程","凯凯"]
        },
        "health": {
            "single": ["瑞","铭","泽","钧","锐","和","安","康","平","宁","和","福","林","柏","森","桐","浩","润","清","沐","炎","旭","煜","昊","昱","炜","圣","峻","辰","坤","哲"],
            "double": ["瑞安","铭泽","钧安","锐和","锦安","铭康","瑞康","平和","林安","柏康","森安","桐康","栋康","楷安","松安","林康","浩安","泽安","润康","清安","沐安","润和","浩康","泽康","炎安","旭康","煜安","昊安","昱康","炜安","熠安","耀康","圣安","峻康","宇安","安福","辰康","坤安","哲安"],
            "reduplicate": ["安安","康康","平平","宁宁","和和","福福","静静","慢慢","稳稳","健健"]
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
        if (!checkDailyLimit()) {
            container.innerHTML = `<div class="name-card"><div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div></div>`;
            return;
        }
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
            if (e.message === "DAILY_LIMIT_REACHED") {
                container.innerHTML = `<div class="name-card"><div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div></div>`;
            } else {
                container.innerHTML = `<div class="error-msg">Generation failed, showing local results</div>`;
                setTimeout(() => renderMeaningDefault(surname, meaningType, styleType), 100);
            }
        });
    }

    async function callMeaningAPI(surname, meaningType, styleType) {
        if (!checkDailyLimit()) {
            throw new Error("DAILY_LIMIT_REACHED");
        }
        const meaningLabels = { "moral": "moral cultivation and virtue", "career": "career ambition and success", "health": "health and safety" };
        const label = meaningLabels[meaningType] || "positive meaning";
        const styleDesc = styleType === "single" ? "single character" : styleType === "double" ? "double character" : "reduplicate";
        const systemPrompt = `You are an expert in Chinese male naming. Respond ONLY with a valid JSON object. Use this exact structure:
{"primary": {"chn": "ChineseName", "pinyin": "Pin Yin with spaces", "meaning": "English meaning", "pronunciation": "English guide"},"alternatives": [{"chn": "Alt1","pinyin": "...","meaning": "...","pronunciation": "..."},{"chn": "Alt2","pinyin": "...","meaning": "...","pronunciation": "..."}]}
Rules: Based on surname "${surname}" and meaning category "${label}" and style "${styleDesc}", provide 3 Chinese male names ONLY. Names MUST be masculine and suitable for men. NEVER provide female names. The names must represent ${label}. Return only JSON.`;
        const userMessage = `Generate 3 Chinese male names for surname "${surname}" with meaning category: ${label} and style: ${styleDesc}. These must be masculine names for men, not women.`;
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

        if (!checkDailyLimit()) {
            container.innerHTML = `<div class="name-card"><div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div></div>`;
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
            if (e.message === "DAILY_LIMIT_REACHED") {
                container.innerHTML = `<div class="name-card"><div class="error-msg">Daily query limit (5 times/day) reached. Please try again tomorrow.</div></div>`;
            } else {
                container.innerHTML = `<div class="error-msg">Generation failed, showing local results</div>`;
                setTimeout(() => renderWuxingDefault(year, month, finalSurname, styleType), 100);
            }
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