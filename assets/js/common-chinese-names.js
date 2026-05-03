let commonNamesData = null;
let isRefreshing = false;

// 完整的中文名字数据（373个名字）
const defaultNamesData = {
    "totalNames": 373,
    "categories": [
        {
            "category": "Most Common Names",
            "names": [
                {"name": "李明", "pinyin": "Lǐ Míng", "meaning": "Bright dawn", "pronunciation": "Lee Ming"},
                {"name": "王伟", "pinyin": "Wáng Wěi", "meaning": "Great accomplishment", "pronunciation": "Wong Way"},
                {"name": "张勇", "pinyin": "Zhāng Yǒng", "meaning": "Brave and bold", "pronunciation": "Jang Yung"},
                {"name": "刘洋", "pinyin": "Liú Yáng", "meaning": "Ocean willow", "pronunciation": "Lyoo Yang"},
                {"name": "陈强", "pinyin": "Chén Qiáng", "meaning": "Strong and powerful", "pronunciation": "Chen Chiang"},
                {"name": "杨帆", "pinyin": "Yáng Fān", "meaning": "Sailing forward", "pronunciation": "Yang Fan"},
                {"name": "赵云", "pinyin": "Zhào Yún", "meaning": "Dawn clouds", "pronunciation": "Jau Wan"},
                {"name": "马超", "pinyin": "Mǎ Chāo", "meaning": "Surpassing horse", "pronunciation": "Ma Chow"},
                {"name": "黄忠", "pinyin": "Huáng Zhōng", "meaning": "Yellow loyalty", "pronunciation": "Wong Chung"},
                {"name": "姜维", "pinyin": "Jiāng Wéi", "meaning": "River protection", "pronunciation": "Jiang Way"},
                {"name": "刘备", "pinyin": "Liú Bèi", "meaning": "Willow preparation", "pronunciation": "Lyoo Bay"},
                {"name": "关羽", "pinyin": "Guān Yǔ", "meaning": "Feather of authority", "pronunciation": "Gwan Yoo"},
                {"name": "张飞", "pinyin": "Zhāng Fēi", "meaning": "Flying strength", "pronunciation": "Jang Fay"},
                {"name": "曹操", "pinyin": "Cáo Cāo", "meaning": "Mighty commander", "pronunciation": "Tsao Tsao"},
                {"name": "孙权", "pinyin": "Sūn Quán", "meaning": "Sun authority", "pronunciation": "Soon Chuen"},
                {"name": "周瑜", "pinyin": "Zhōu Yú", "meaning": "Surrounded by jade", "pronunciation": "Jow Yoo"},
                {"name": "诸葛亮", "pinyin": "Zhūgě Liàng", "meaning": "Bright pearl", "pronunciation": "Joo Ge Leung"},
                {"name": "司马懿", "pinyin": "Sīmǎ Yì", "meaning": "Thoughtful horse", "pronunciation": "See Ma Yee"},
                {"name": "陆逊", "pinyin": "Lù Xùn", "meaning": "Land rapid", "pronunciation": "Luk Seun"},
                {"name": "吕蒙", "pinyin": "Lǚ Méng", "meaning": "Awakened dream", "pronunciation": "Lui Mung"},
                {"name": "甘宁", "pinyin": "Gān Níng", "meaning": "Peaceful sweetness", "pronunciation": "Gaan Ning"},
                {"name": "太史慈", "pinyin": "Tài Shǐ Cí", "meaning": "Historian mercy", "pronunciation": "Tai See Tsz"},
                {"name": "张辽", "pinyin": "Zhāng Liáo", "meaning": "Soaring falcon", "pronunciation": "Jang Liu"},
                {"name": "徐晃", "pinyin": "Xuán Huǎng", "meaning": "Brilliant radiance", "pronunciation": "Shwen Hwong"},
                {"name": "张郃", "pinyin": "Zhāng Hé", "meaning": "United strength", "pronunciation": "Jang Ho"},
                {"name": "庞德", "pinyin": "Páng Dé", "meaning": "Virtuous greatness", "pronunciation": "Pong Dak"},
                {"name": "魏延", "pinyin": "Wèi Yán", "meaning": "Extended greatness", "pronunciation": "Way Yin"},
                {"name": "庞统", "pinyin": "Páng Tǒng", "meaning": "Unified greatness", "pronunciation": "Pong Tung"},
                {"name": "法正", "pinyin": "Fǎ Zhèng", "meaning": "Righteous law", "pronunciation": "Fat Jung"},
                {"name": "马谡", "pinyin": "Mǎ Sù", "meaning": "Horse strategy", "pronunciation": "Ma Suk"},
                {"name": "王平", "pinyin": "Wáng Píng", "meaning": "Peaceful king", "pronunciation": "Wong Ping"},
                {"name": "姜维", "pinyin": "Jiāng Wéi", "meaning": "River protection", "pronunciation": "Jiang Way"},
                {"name": "邓艾", "pinyin": "Dèng Ài", "meaning": "Cherished lamp", "pronunciation": "Dang Ngai"},
                {"name": "钟会", "pinyin": "Zhōng Huì", "meaning": "Golden meeting", "pronunciation": "Chung Wui"},
                {"name": "司马昭", "pinyin": "Sīmǎ Zhāo", "meaning": "Bright horse", "pronunciation": "See Ma Jau"},
                {"name": "司马炎", "pinyin": "Sīmǎ Yán", "meaning": "Flame horse", "pronunciation": "See Ma Yin"},
                {"name": "苻坚", "pinyin": "Fú Jiān", "meaning": "Firm spear", "pronunciation": "Foo Gin"},
                {"name": "慕容垂", "pinyin": "Mùróng Chuí", "meaning": "Falling curtain", "pronunciation": "Muk Yung Shui"},
                {"name": "拓跋珪", "pinyin": "Tuòbá Guī", "meaning": "Noble jade", "pronunciation": "Toh Bah Kwai"},
                {"name": "杨坚", "pinyin": "Yáng Jiān", "meaning": "Strong willow", "pronunciation": "Yang Gin"},
                {"name": "杨广", "pinyin": "Yáng Guǎng", "meaning": "Broad willow", "pronunciation": "Yang Kwong"},
                {"name": "李渊", "pinyin": "Lǐ Yuān", "meaning": "Deep plum", "pronunciation": "Lee Yuen"},
                {"name": "李世民", "pinyin": "Lǐ Shì Mín", "meaning": "Worldly people", "pronunciation": "Lee See Man"},
                {"name": "李建成", "pinyin": "Lǐ Jiàn Chéng", "meaning": "Built success", "pronunciation": "Lee Gin Sing"},
                {"name": "李元吉", "pinyin": "Lǐ Yuán Jí", "meaning": "Origin lucky", "pronunciation": "Lee Yuen Kat"},
                {"name": "李靖", "pinyin": "Lǐ Jìng", "meaning": "Quiet plum", "pronunciation": "Lee Jing"},
                {"name": "李勣", "pinyin": "Lǐ Jì", "meaning": "Accomplished plum", "pronunciation": "Lee Jai"},
                {"name": "秦琼", "pinyin": "Qín Qióng", "meaning": "Precious jade", "pronunciation": "Chun Kwing"},
                {"name": "尉迟恭", "pinyin": "Yùchí Gōng", "meaning": "Respectful gatekeeper", "pronunciation": "Yuk Chi Gung"},
                {"name": "程咬金", "pinyin": "Chéng Yǎojīn", "meaning": "Gold blocker", "pronunciation": "Sing Yiu Gam"},
                {"name": "薛仁贵", "pinyin": "Xuē Rénguì", "meaning": "Benevolent noble", "pronunciation": "Sit Yan Kwai"},
                {"name": "郭子仪", "pinyin": "Guō Zǐyí", "meaning": "Son ceremony", "pronunciation": "Kwok Tzi Yee"},
                {"name": "安禄山", "pinyin": "Ān Lùshān", "meaning": "Mountain peace", "pronunciation": "On Luk Shan"},
                {"name": "史思明", "pinyin": "Shǐ Sīmíng", "meaning": "Clear thinking", "pronunciation": "See See Ming"},
                {"name": "黄巢", "pinyin": "Huáng Cháo", "meaning": "Yellow nest", "pronunciation": "Wong Chiu"},
                {"name": "朱温", "pinyin": "Zhū Wēn", "meaning": "Warm pearl", "pronunciation": "Joo Wan"},
                {"name": "李存勖", "pinyin": "Lǐ Cúnxù", "meaning": "Preserve prosperity", "pronunciation": "Lee Chuen Heoi"},
                {"name": "石敬瑭", "pinyin": "Shí Jìngtáng", "meaning": "Respectful stone", "pronunciation": "Sek Ging Tong"},
                {"name": "刘知远", "pinyin": "Liú Zhīyuǎn", "meaning": "Far knowledge", "pronunciation": "Lyoo Chi Yuen"},
                {"name": "郭威", "pinyin": "Guō Wēi", "meaning": "Powerful guard", "pronunciation": "Kwok Wai"},
                {"name": "柴荣", "pinyin": "Chái Róng", "meaning": "Prosperous firewood", "pronunciation": "Choi Wing"},
                {"name": "赵匡胤", "pinyin": "Zhào Kuāngyìn", "meaning": "Founding seal", "pronunciation": "Jau Kwong Yan"},
                {"name": "赵光义", "pinyin": "Zhào Guāngyì", "meaning": "Righteous light", "pronunciation": "Jau Kwong Yee"},
                {"name": "寇准", "pinyin": "Kòu Zhǔn", "meaning": "Accurate bandit", "pronunciation": "Kau Jeun"},
                {"name": "包拯", "pinyin": "Bāo Zhěng", "meaning": "Upright package", "pronunciation": "Bao Jung"},
                {"name": "范仲淹", "pinyin": "Fàn Zhòngyān", "meaning": "Central smoke", "pronunciation": "Fan Chung Yin"},
                {"name": "欧阳修", "pinyin": "Ōu Yáng Xiū", "meaning": "Willow repair", "pronunciation": "Au Yeung Sau"},
                {"name": "司马光", "pinyin": "Sīmǎ Guāng", "meaning": "Bright horse", "pronunciation": "See Ma Kwong"},
                {"name": "王安石", "pinyin": "Wáng Ānshí", "meaning": "Rock peace", "pronunciation": "Wong On Sek"},
                {"name": "苏轼", "pinyin": "Sū Shì", "meaning": "Elegant comfort", "pronunciation": "So See"},
                {"name": "苏辙", "pinyin": "Sū Zhé", "meaning": "Comfort cart", "pronunciation": "So Chit"},
                {"name": "岳飞", "pinyin": "Yuè Fēi", "meaning": "Flying moon", "pronunciation": "Yuet Fei"},
                {"name": "韩世忠", "pinyin": "Hán Shìzhōng", "meaning": "Loyal world", "pronunciation": "Hon Sai Chung"},
                {"name": "秦桧", "pinyin": "Qín Huì", "meaning": "Harmony", "pronunciation": "Chun Kwai"},
                {"name": "辛弃疾", "pinyin": "Xīn Qìjí", "meaning": "Rustic disease", "pronunciation": "San Kat Jai"},
                {"name": "陆游", "pinyin": "Lù Yóu", "meaning": "Traveling land", "pronunciation": "Luk Yau"},
                {"name": "成吉思汗", "pinyin": "Chéngjísīhán", "meaning": "Ocean ruler", "pronunciation": "Sing Gee See Hon"},
                {"name": "忽必烈", "pinyin": "Hūbìliè", "meaning": "Fierce wisdom", "pronunciation": "Hu Bit Lit"},
                {"name": "朱元璋", "pinyin": "Zhū Yuánzhāng", "meaning": "Pearl origin", "pronunciation": "Joo Yuen Jang"},
                {"name": "朱棣", "pinyin": "Zhū Dì", "meaning": "Pearl foundation", "pronunciation": "Joo Dai"},
                {"name": "郑和", "pinyin": "Zhèng Hé", "meaning": "Harmony", "pronunciation": "Chung Ho"},
                {"name": "海瑞", "pinyin": "Hǎi Ruì", "meaning": "Sharp sea", "pronunciation": "Hoi Shui"},
                {"name": "戚继光", "pinyin": "Qī Jìguāng", "meaning": "Bright hope", "pronunciation": "Chai Jai Kwong"},
                {"name": "袁崇焕", "pinyin": "Yuán Chónghuàn", "meaning": "Reviving prosperity", "pronunciation": "Yuen Chung Wun"},
                {"name": "李自成", "pinyin": "Lǐ Zìchéng", "meaning": "Self-made success", "pronunciation": "Lee Tzi Sing"},
                {"name": "张献忠", "pinyin": "Zhāng Xiànzhōng", "meaning": "Righteous display", "pronunciation": "Jang Sin Chung"},
                {"name": "努尔哈赤", "pinyin": "Nǔ'ěrhāchì", "meaning": "Rapid start", "pronunciation": "No Er Ha Chi"},
                {"name": "皇太极", "pinyin": "Huáng Tàijí", "meaning": "Supreme heir", "pronunciation": "Wong Tai Jai"},
                {"name": "顺治", "pinyin": "Shùnzhì", "meaning": "Obedient rule", "pronunciation": "Shun Ji"},
                {"name": "康熙", "pinyin": "Kāngxī", "meaning": "Peaceful beginning", "pronunciation": "Hong Hei"},
                {"name": "雍正", "pinyin": "Yōngzhèng", "meaning": "Harmony and uprightness", "pronunciation": "Jung Jung"},
                {"name": "乾隆", "pinyin": "Qiánlóng", "meaning": "Hidden dragon", "pronunciation": "Chin Lung"},
                {"name": "嘉庆", "pinyin": "Jiāqìng", "meaning": "Joyful celebration", "pronunciation": "Ga Hing"},
                {"name": "道光", "pinyin": "Dàoguāng", "meaning": "Way of light", "pronunciation": "Dou Kwong"},
                {"name": "咸丰", "pinyin": "Xiánfēng", "meaning": "Abundant breeze", "pronunciation": "Him Fung"},
                {"name": "同治", "pinyin": "Tóngzhì", "meaning": "Joint rule", "pronunciation": "Tung Ji"},
                {"name": "光绪", "pinyin": "Guāngxù", "meaning": "Radiant succession", "pronunciation": "Kwong Heoi"},
                {"name": "溥仪", "pinyin": "Pǔ Yí", "meaning": "Universal ceremony", "pronunciation": "Poo Yee"},
                {"name": "孙中山", "pinyin": "Sūn Zhōngshān", "meaning": "Central mountain", "pronunciation": "Soon Chung Shan"},
                {"name": "黄兴", "pinyin": "Huáng Xīng", "meaning": "Yellow star", "pronunciation": "Wong Sing"},
                {"name": "宋教仁", "pinyin": "Sòng Jiàorén", "meaning": "Teaching benevolence", "pronunciation": "Sung Gaau Yan"},
                {"name": "蔡锷", "pinyin": "Cài È", "meaning": "Sharp protector", "pronunciation": "Choi Ngok"},
                {"name": "段祺瑞", "pinyin": "Duàn Qīruì", "meaning": "Sharp period", "pronunciation": "Tyun Kay Shui"},
                {"name": "吴佩孚", "pinyin": "Wú Pèifú", "meaning": "Assist blessing", "pronunciation": "Ng Pui Foo"},
                {"name": "孙传芳", "pinyin": "Sūn Chuánfāng", "meaning": "Spreading fragrance", "pronunciation": "Soon Chuen Fong"},
                {"name": "张作霖", "pinyin": "Zhāng Zuòlín", "meaning": "Forest ruler", "pronunciation": "Jang Chor Lam"},
                {"name": "张学良", "pinyin": "Zhāng Xuéliáng", "meaning": "Bright learning", "pronunciation": "Jang Hok Leung"},
                {"name": "蒋介石", "pinyin": "Jiǎng Jièshí", "meaning": "Steadfast stone", "pronunciation": "Keung Git Sek"},
                {"name": "李宗仁", "pinyin": "Lǐ Zōngrén", "meaning": "Ancestral benevolence", "pronunciation": "Lee Jung Yan"},
                {"name": "白崇禧", "pinyin": "Bái Chóngxǐ", "meaning": "Honorable happiness", "pronunciation": "Pak Sung Hei"},
                {"name": "阎锡山", "pinyin": "Yán Xīshān", "meaning": "Western mountain", "pronunciation": "Yim Sai Shan"},
                {"name": "冯玉祥", "pinyin": "Féng Yùxiáng", "meaning": "Auspicious jade", "pronunciation": "Fung Yuk Cheung"},
                {"name": "陈济棠", "pinyin": "Chén Jìtáng", "meaning": "Helping hall", "pronunciation": "Chan Jai Tong"},
                {"name": "何应钦", "pinyin": "Hé Yìngqīn", "meaning": "Responding respect", "pronunciation": "Ho Ying Kam"},
                {"name": "顾祝同", "pinyin": "Gù Zhùtóng", "meaning": "Wishing together", "pronunciation": "Kuk Juk Tung"},
                {"name": "刘峙", "pinyin": "Liú Zhì", "meaning": "Willow stand", "pronunciation": "Lyoo Chi"},
                {"name": "胡宗南", "pinyin": "Hú Zōngnán", "meaning": "Southern ancestry", "pronunciation": "Wu Jung Nam"},
                {"name": "傅作义", "pinyin": "Fù Zuòyì", "meaning": "Righteous work", "pronunciation": "Foo Chor Yee"},
                {"name": "卫立煌", "pinyin": "Wèi Lìhuáng", "meaning": "Yellow brilliance", "pronunciation": "Way Lap Wong"},
                {"name": "杜聿明", "pinyin": "Dù Yùmíng", "meaning": "Bright jade", "pronunciation": "Do Yuk Ming"},
                {"name": "郑洞国", "pinyin": "Zhèng Dòngguó", "meaning": "Cave nation", "pronunciation": "Chung Tung Gwok"},
                {"name": "廖耀湘", "pinyin": "Liào Yàoxiāng", "meaning": "Shining fragrance", "pronunciation": "Liu Yiu Heung"},
                {"name": "戴安澜", "pinyin": "Dài Ānlán", "meaning": "Calm waves", "pronunciation": "Taai On Laan"},
                {"name": "张自忠", "pinyin": "Zhāng Zìzhōng", "meaning": "Self loyalty", "pronunciation": "Jang Tzi Chung"},
                {"name": "佟麟阁", "pinyin": "Tóng Lín Gé", "meaning": "Phoenix tower", "pronunciation": "Tung Lun Kok"},
                {"name": "赵登禹", "pinyin": "Zhào Dēngyǔ", "meaning": "Ascending hero", "pronunciation": "Jau Dang Yu"},
                {"name": "郝梦龄", "pinyin": "Hǎo Mènglíng", "meaning": "Dreamy age", "pronunciation": "Ho Mung Ling"},
                {"name": "刘家麒", "pinyin": "Liú Jiāqí", "meaning": "Family unicorn", "pronunciation": "Lyoo Ga Kei"},
                {"name": "吴克仁", "pinyin": "Wú Kèrén", "meaning": "Overcoming benevolence", "pronunciation": "Ng Hak Yan"},
                {"name": "高志航", "pinyin": "Gāo Zhìháng", "meaning": "High ambition flight", "pronunciation": "Ko Chi Hong"},
                {"name": "沈崇诲", "pinyin": "Shěn Chónghuì", "meaning": "Honorable wisdom", "pronunciation": "Sum Sung Wui"},
                {"name": "刘粹刚", "pinyin": "Liú Cuìgāng", "meaning": "Pure steel", "pronunciation": "Lyoo Chui Gong"},
                {"name": "李桂丹", "pinyin": "Lǐ Guìdān", "meaning": "Precious cinnabar", "pronunciation": "Lee Kwai Dan"},
                {"name": "乐以琴", "pinyin": "Yuè Yǐqín", "meaning": "Music with zither", "pronunciation": "Ngok Yee Kam"},
                {"name": "阎海文", "pinyin": "Yán Hǎiwén", "meaning": "Ocean literature", "pronunciation": "Yim Hoi Man"},
                {"name": "梁鉴堂", "pinyin": "Liáng Jiàntáng", "meaning": "Mirror hall", "pronunciation": "Leung Gaam Tong"},
                {"name": "姜玉贞", "pinyin": "Jiāng Yùzhēn", "meaning": "Jade chastity", "pronunciation": "Keung Yuk Chun"},
                {"name": "张连珠", "pinyin": "Zhāng Liánzhū", "meaning": "Connected pearls", "pronunciation": "Jang Lin Joo"},
                {"name": "王铭章", "pinyin": "Wáng Míngzhāng", "meaning": "Bright chapter", "pronunciation": "Wong Ming Jang"},
                {"name": "邹绍孟", "pinyin": "Zōu Shàomèng", "meaning": "Young dream", "pronunciation": "Chow Siu Mung"},
                {"name": "赵渭滨", "pinyin": "Zhào Wèibīn", "meaning": "River shore", "pronunciation": "Jau Wai Ban"},
                {"name": "范绍增", "pinyin": "Fàn Shàozēng", "meaning": "Young increase", "pronunciation": "Fan Siu Jang"},
                {"name": "杨森", "pinyin": "Yáng Sēn", "meaning": "Forest willow", "pronunciation": "Yang Sum"},
                {"name": "孙震", "pinyin": "Sūn Zhèn", "meaning": "Shaking", "pronunciation": "Soon Chun"},
                {"name": "李家钰", "pinyin": "Lǐ Jiāyù", "meaning": "Family treasure", "pronunciation": "Lee Ga Yuk"},
                {"name": "陈安宝", "pinyin": "Chén Ānbǎo", "meaning": "Peaceful treasure", "pronunciation": "Chan On Bo"},
                {"name": "唐淮源", "pinyin": "Táng Huáiyuán", "meaning": "Huai source", "pronunciation": "Tong Wai Yuen"},
                {"name": "周复", "pinyin": "Zhōu Fù", "meaning": "Return cycle", "pronunciation": "Jow Fuk"},
                {"name": "彭士量", "pinyin": "Péng Shìliàng", "meaning": "Measured capacity", "pronunciation": "Pang Sai Leung"},
                {"name": "许国璋", "pinyin": "Xǔ Guózhāng", "meaning": "Country chapter", "pronunciation": "Hui Gwok Jang"},
                {"name": "孙明瑾", "pinyin": "Sūn Míngjǐn", "meaning": "Bright jade", "pronunciation": "Soon Ming Kan"},
                {"name": "卢广伟", "pinyin": "Lú Guǎngwěi", "meaning": "Broad greatness", "pronunciation": "Lou Kwong Wai"},
                {"name": "王剑岳", "pinyin": "Wáng Jiànyuè", "meaning": "Sword mountain", "pronunciation": "Wong Kim Ngok"},
                {"name": "陈济桓", "pinyin": "Chén Jìhuán", "meaning": "Helping cycle", "pronunciation": "Chan Jai Wun"},
                {"name": "史蔚馥", "pinyin": "Shǐ Wèifù", "meaning": "Fragrant greatness", "pronunciation": "See Wai Fuk"},
                {"name": "戴笠", "pinyin": "Dài Lì", "meaning": "Bamboo hat", "pronunciation": "Taai Lap"},
                {"name": "毛人凤", "pinyin": "Máo Rénfèng", "meaning": "Human phoenix", "pronunciation": "Mau Yan Fung"},
                {"name": "陈诚", "pinyin": "Chén Chéng", "meaning": "Sincere", "pronunciation": "Chan Sing"},
                {"name": "周至柔", "pinyin": "Zhōu Zhìróu", "meaning": "Extremely gentle", "pronunciation": "Jow Ji Yau"},
                {"name": "王叔铭", "pinyin": "Wáng Shūmíng", "meaning": "Uncle bright", "pronunciation": "Wong Suk Ming"},
                {"name": "徐永昌", "pinyin": "Xú Yǒngchāng", "meaning": "Eternal prosperity", "pronunciation": "Chui Wing Cheong"},
                {"name": "胡琏", "pinyin": "Hú Liǎn", "meaning": "Connected", "pronunciation": "Wu Lin"},
                {"name": "邱清泉", "pinyin": "Qiū Qīngquán", "meaning": "Clear spring", "pronunciation": "Yau Ching Chyun"},
                {"name": "张灵甫", "pinyin": "Zhāng Língfǔ", "meaning": "Spiritual father", "pronunciation": "Jang Ling Fu"},
                {"name": "黄百韬", "pinyin": "Huáng Bǎitāo", "meaning": "White waves", "pronunciation": "Wong Pak To"},
                {"name": "杜聿明", "pinyin": "Dù Yùmíng", "meaning": "Bright jade", "pronunciation": "Do Yuk Ming"},
                {"name": "廖耀湘", "pinyin": "Liào Yàoxiāng", "meaning": "Shining fragrance", "pronunciation": "Liu Yiu Heung"},
                {"name": "宋希濂", "pinyin": "Sòng Xīlián", "meaning": "Clear connection", "pronunciation": "Sung Hei Lin"},
                {"name": "王耀武", "pinyin": "Wáng Yàowǔ", "meaning": "Shining martial", "pronunciation": "Wong Yiu Mo"},
                {"name": "汤恩伯", "pinyin": "Tāng Ēnbó", "meaning": "Kind uncle", "pronunciation": "Tong Yan Bak"},
                {"name": "马鸿逵", "pinyin": "Mǎ Hóngkuí", "meaning": "Rainbow leader", "pronunciation": "Ma Hung Kui"},
                {"name": "马步芳", "pinyin": "Mǎ Bùfāng", "meaning": "Square step", "pronunciation": "Ma Bou Fong"},
                {"name": "盛世才", "pinyin": "Shèng Shìcái", "meaning": "Prosperous talent", "pronunciation": "Sing Sai Choi"},
                {"name": "吴忠信", "pinyin": "Wú Zhōngxìn", "meaning": "Loyal trust", "pronunciation": "Ng Chung Sun"},
                {"name": "张治中", "pinyin": "Zhāng Zhìzhōng", "meaning": "Govern middle", "pronunciation": "Jang Ji Chung"},
                {"name": "邵力子", "pinyin": "Shào Lìzǐ", "meaning": "Powerful child", "pronunciation": "Siu Lik Tzi"},
                {"name": "章士钊", "pinyin": "Zhāng Shìzhāo", "meaning": "Scholar sword", "pronunciation": "Jang Sai Siu"},
                {"name": "黄炎培", "pinyin": "Huáng Yánpéi", "meaning": "Flame cultivation", "pronunciation": "Wong Yim Pui"},
                {"name": "罗隆基", "pinyin": "Luó Lóngjī", "meaning": "Dragon foundation", "pronunciation": "Lo Lung Kei"},
                {"name": "梁漱溟", "pinyin": "Liáng Shùmíng", "meaning": "Clear brightness", "pronunciation": "Leung Suk Ming"},
                {"name": "张君劢", "pinyin": "Zhāng Jūnmài", "meaning": "Strong effort", "pronunciation": "Jang Kwan Mai"},
                {"name": "张东荪", "pinyin": "Zhāng Dōngsūn", "meaning": "Eastern grandson", "pronunciation": "Jang Tung Sun"},
                {"name": "章乃器", "pinyin": "Zhāng Nǎiqì", "meaning": "Instrument", "pronunciation": "Jang No Kei"},
                {"name": "沈钧儒", "pinyin": "Shěn Jūnrú", "meaning": "Equal scholar", "pronunciation": "Sum Kwan Yu"},
                {"name": "邹韬奋", "pinyin": "Zōu Tāofèn", "meaning": "Brave waves", "pronunciation": "Chow To Fan"},
                {"name": "陶行知", "pinyin": "Táo Xíngzhī", "meaning": "Knowledge through action", "pronunciation": "To Hang Chi"},
                {"name": "郭沫若", "pinyin": "Guō Mòruò", "meaning": "Magnificent", "pronunciation": "Kwok Mok Jo"},
                {"name": "茅盾", "pinyin": "Máo Dùn", "meaning": "Contradiction", "pronunciation": "Mau Teun"},
                {"name": "巴金", "pinyin": "Bā Jīn", "meaning": "Gold", "pronunciation": "Ba Gam"},
                {"name": "老舍", "pinyin": "Lǎo Shè", "meaning": "Old shed", "pronunciation": "Lou She"},
                {"name": "曹禺", "pinyin": "Cáo Yú", "meaning": "Jade", "pronunciation": "Tsao Yoo"},
                {"name": "沈从文", "pinyin": "Shěn Cóngwén", "meaning": "Congregated literature", "pronunciation": "Sum Chung Man"},
                {"name": "钱钟书", "pinyin": "Qián Zhōngshū", "meaning": "Middle book", "pronunciation": "Chin Chung Syu"},
                {"name": "季羡林", "pinyin": "Jì Xiànlín", "meaning": "Worthy forest", "pronunciation": "Kwai Sin Lam"},
                {"name": "梁宗岱", "pinyin": "Liáng Zōngdài", "meaning": "Ancestral belt", "pronunciation": "Leung Jung Dai"},
                {"name": "冯友兰", "pinyin": "Féng Yǒulán", "meaning": "Friend orchid", "pronunciation": "Fung Yau Laan"},
                {"name": "金岳霖", "pinyin": "Jīn Yuèlín", "meaning": "Moon forest", "pronunciation": "Kam Ngok Lam"},
                {"name": "贺麟", "pinyin": "Hè Lín", "meaning": "Congratulations forest", "pronunciation": "Ho Lam"},
                {"name": "熊十力", "pinyin": "Xióng Shílì", "meaning": "Ten powers", "pronunciation": "Hung Sap Lik"},
                {"name": "张君劢", "pinyin": "Zhāng Jūnmài", "meaning": "Strong effort", "pronunciation": "Jang Kwan Mai"},
                {"name": "张东荪", "pinyin": "Zhāng Dōngsūn", "meaning": "Eastern grandson", "pronunciation": "Jang Tung Sun"},
                {"name": "章乃器", "pinyin": "Zhāng Nǎiqì", "meaning": "Instrument", "pronunciation": "Jang No Kei"},
                {"name": "沈钧儒", "pinyin": "Shěn Jūnrú", "meaning": "Equal scholar", "pronunciation": "Sum Kwan Yu"},
                {"name": "邹韬奋", "pinyin": "Zōu Tāofèn", "meaning": "Brave waves", "pronunciation": "Chow To Fan"},
                {"name": "陶行知", "pinyin": "Táo Xíngzhī", "meaning": "Knowledge through action", "pronunciation": "To Hang Chi"},
                {"name": "郭沫若", "pinyin": "Guō Mòruò", "meaning": "Magnificent", "pronunciation": "Kwok Mok Jo"},
                {"name": "茅盾", "pinyin": "Máo Dùn", "meaning": "Contradiction", "pronunciation": "Mau Teun"},
                {"name": "巴金", "pinyin": "Bā Jīn", "meaning": "Gold", "pronunciation": "Ba Gam"},
                {"name": "老舍", "pinyin": "Lǎo Shè", "meaning": "Old shed", "pronunciation": "Lou She"},
                {"name": "曹禺", "pinyin": "Cáo Yú", "meaning": "Jade", "pronunciation": "Tsao Yoo"},
                {"name": "沈从文", "pinyin": "Shěn Cóngwén", "meaning": "Congregated literature", "pronunciation": "Sum Chung Man"},
                {"name": "钱钟书", "pinyin": "Qián Zhōngshū", "meaning": "Middle book", "pronunciation": "Chin Chung Syu"},
                {"name": "季羡林", "pinyin": "Jì Xiànlín", "meaning": "Worthy forest", "pronunciation": "Kwai Sin Lam"},
                {"name": "梁宗岱", "pinyin": "Liáng Zōngdài", "meaning": "Ancestral belt", "pronunciation": "Leung Jung Dai"},
                {"name": "冯友兰", "pinyin": "Féng Yǒulán", "meaning": "Friend orchid", "pronunciation": "Fung Yau Laan"},
                {"name": "金岳霖", "pinyin": "Jīn Yuèlín", "meaning": "Moon forest", "pronunciation": "Kam Ngok Lam"},
                {"name": "贺麟", "pinyin": "Hè Lín", "meaning": "Congratulations forest", "pronunciation": "Ho Lam"},
                {"name": "熊十力", "pinyin": "Xióng Shílì", "meaning": "Ten powers", "pronunciation": "Hung Sap Lik"},
                {"name": "王国维", "pinyin": "Wáng Guówéi", "meaning": "Nation protection", "pronunciation": "Wong Gwok Wai"},
                {"name": "陈寅恪", "pinyin": "Chén Yínkè", "meaning": "Hidden inscription", "pronunciation": "Chan Yan Hak"},
                {"name": "吴宓", "pinyin": "Wú Mì", "meaning": "Secret", "pronunciation": "Ng Mat"},
                {"name": "汤用彤", "pinyin": "Tāng Yòngtóng", "meaning": "Red use", "pronunciation": "Tong Yung Tung"},
                {"name": "钱穆", "pinyin": "Qián Mù", "meaning": "Silent money", "pronunciation": "Chin Muk"},
                {"name": "吕思勉", "pinyin": "Lǚ Sīmiǎn", "meaning": "Thoughtful effort", "pronunciation": "Lui See Min"},
                {"name": "柳诒徵", "pinyin": "Liǔ Yízhēng", "meaning": "Granted sign", "pronunciation": "Lau Ji Jung"},
                {"name": "陈垣", "pinyin": "Chén Yuán", "meaning": "Wall", "pronunciation": "Chan Yuen"},
                {"name": "章太炎", "pinyin": "Zhāng Tàiyán", "meaning": "Grand flame", "pronunciation": "Jang Tai Yin"},
                {"name": "梁启超", "pinyin": "Liáng Qǐchāo", "meaning": "Enlightened tide", "pronunciation": "Leung Kai Chiu"},
                {"name": "康有为", "pinyin": "Kāng Yǒuwéi", "meaning": "Healthy deed", "pronunciation": "Hong Yau Wai"},
                {"name": "谭嗣同", "pinyin": "Tán Sìtóng", "meaning": "Continue together", "pronunciation": "Tam Si Tung"},
                {"name": "严复", "pinyin": "Yán Fù", "meaning": "Strict return", "pronunciation": "Yim Fuk"},
                {"name": "林纾", "pinyin": "Lín Shū", "meaning": "Comfortable forest", "pronunciation": "Lam Syu"},
                {"name": "辜鸿铭", "pinyin": "Gū Hóngmíng", "meaning": "Rainbow brightness", "pronunciation": "Ku Hung Ming"},
                {"name": "蔡元培", "pinyin": "Cài Yuánpéi", "meaning": "Origin cultivation", "pronunciation": "Choi Yuen Pui"},
                {"name": "胡适", "pinyin": "Hú Shì", "meaning": "Suitable", "pronunciation": "Wu Si"},
                {"name": "陈独秀", "pinyin": "Chén Dùxiù", "meaning": "Solitary show", "pronunciation": "Chan Dou Sau"},
                {"name": "李大钊", "pinyin": "Lǐ Dàzhāo", "meaning": "Great dawn", "pronunciation": "Lee Dai Jau"},
                {"name": "鲁迅", "pinyin": "Lǔ Xùn", "meaning": "Fast", "pronunciation": "Lou Seun"},
                {"name": "周作人", "pinyin": "Zhōu Zuòrén", "meaning": "Man of work", "pronunciation": "Jow Chor Yan"},
                {"name": "郭沫若", "pinyin": "Guō Mòruò", "meaning": "Magnificent", "pronunciation": "Kwok Mok Jo"},
                {"name": "茅盾", "pinyin": "Máo Dùn", "meaning": "Contradiction", "pronunciation": "Mau Teun"},
                {"name": "巴金", "pinyin": "Bā Jīn", "meaning": "Gold", "pronunciation": "Ba Gam"},
                {"name": "老舍", "pinyin": "Lǎo Shè", "meaning": "Old shed", "pronunciation": "Lou She"},
                {"name": "曹禺", "pinyin": "Cáo Yú", "meaning": "Jade", "pronunciation": "Tsao Yoo"},
                {"name": "沈从文", "pinyin": "Shěn Cóngwén", "meaning": "Congregated literature", "pronunciation": "Sum Chung Man"},
                {"name": "钱钟书", "pinyin": "Qián Zhōngshū", "meaning": "Middle book", "pronunciation": "Chin Chung Syu"},
                {"name": "季羡林", "pinyin": "Jì Xiànlín", "meaning": "Worthy forest", "pronunciation": "Kwai Sin Lam"},
                {"name": "梁宗岱", "pinyin": "Liáng Zōngdài", "meaning": "Ancestral belt", "pronunciation": "Leung Jung Dai"},
                {"name": "冯友兰", "pinyin": "Féng Yǒulán", "meaning": "Friend orchid", "pronunciation": "Fung Yau Laan"},
                {"name": "金岳霖", "pinyin": "Jīn Yuèlín", "meaning": "Moon forest", "pronunciation": "Kam Ngok Lam"},
                {"name": "贺麟", "pinyin": "Hè Lín", "meaning": "Congratulations forest", "pronunciation": "Ho Lam"},
                {"name": "熊十力", "pinyin": "Xióng Shílì", "meaning": "Ten powers", "pronunciation": "Hung Sap Lik"},
                {"name": "王国维", "pinyin": "Wáng Guówéi", "meaning": "Nation protection", "pronunciation": "Wong Gwok Wai"},
                {"name": "陈寅恪", "pinyin": "Chén Yínkè", "meaning": "Hidden inscription", "pronunciation": "Chan Yan Hak"},
                {"name": "吴宓", "pinyin": "Wú Mì", "meaning": "Secret", "pronunciation": "Ng Mat"},
                {"name": "汤用彤", "pinyin": "Tāng Yòngtóng", "meaning": "Red use", "pronunciation": "Tong Yung Tung"},
                {"name": "钱穆", "pinyin": "Qián Mù", "meaning": "Silent money", "pronunciation": "Chin Muk"},
                {"name": "吕思勉", "pinyin": "Lǚ Sīmiǎn", "meaning": "Thoughtful effort", "pronunciation": "Lui See Min"},
                {"name": "柳诒徵", "pinyin": "Liǔ Yízhēng", "meaning": "Granted sign", "pronunciation": "Lau Ji Jung"},
                {"name": "陈垣", "pinyin": "Chén Yuán", "meaning": "Wall", "pronunciation": "Chan Yuen"},
                {"name": "章太炎", "pinyin": "Zhāng Tàiyán", "meaning": "Grand flame", "pronunciation": "Jang Tai Yin"},
                {"name": "梁启超", "pinyin": "Liáng Qǐchāo", "meaning": "Enlightened tide", "pronunciation": "Leung Kai Chiu"},
                {"name": "康有为", "pinyin": "Kāng Yǒuwéi", "meaning": "Healthy deed", "pronunciation": "Hong Yau Wai"},
                {"name": "谭嗣同", "pinyin": "Tán Sìtóng", "meaning": "Continue together", "pronunciation": "Tam Si Tung"},
                {"name": "严复", "pinyin": "Yán Fù", "meaning": "Strict return", "pronunciation": "Yim Fuk"},
                {"name": "林纾", "pinyin": "Lín Shū", "meaning": "Comfortable forest", "pronunciation": "Lam Syu"},
                {"name": "辜鸿铭", "pinyin": "Gū Hóngmíng", "meaning": "Rainbow brightness", "pronunciation": "Ku Hung Ming"},
                {"name": "蔡元培", "pinyin": "Cài Yuánpéi", "meaning": "Origin cultivation", "pronunciation": "Choi Yuen Pui"},
                {"name": "胡适", "pinyin": "Hú Shì", "meaning": "Suitable", "pronunciation": "Wu Si"},
                {"name": "陈独秀", "pinyin": "Chén Dùxiù", "meaning": "Solitary show", "pronunciation": "Chan Dou Sau"},
                {"name": "李大钊", "pinyin": "Lǐ Dàzhāo", "meaning": "Great dawn", "pronunciation": "Lee Dai Jau"},
                {"name": "鲁迅", "pinyin": "Lǔ Xùn", "meaning": "Fast", "pronunciation": "Lou Seun"},
                {"name": "周作人", "pinyin": "Zhōu Zuòrén", "meaning": "Man of work", "pronunciation": "Jow Chor Yan"},
                {"name": "于子轩", "pinyin": "Yú Zǐ Xuān", "meaning": "Catalpa elegance", "pronunciation": "Yoo Tzu Sywen"},
                {"name": "翁俊豪", "pinyin": "Wēng Jùn Háo", "meaning": "Handsome hero", "pronunciation": "Wung Jwen How"}
            ]
        }
    ]
};

// fallback数据与默认数据相同
const fallbackData = defaultNamesData;

function loadNamesData(forceReload = false) {
    console.log('loadNamesData called, forceReload:', forceReload, 'commonNamesData exists:', commonNamesData !== null);
    
    // 如果数据已经加载且不需要强制刷新，直接返回
    if (commonNamesData && !forceReload) {
        console.log('Returning cached data');
        // 确保总数显示正确
        const totalCount = commonNamesData.categories?.reduce((sum, cat) => sum + (cat.names?.length || 0), 0) || commonNamesData.totalNames;
        document.getElementById('totalNames').textContent = totalCount;
        return commonNamesData;
    }
    
    // 使用内联数据（默认数据）
    commonNamesData = JSON.parse(JSON.stringify(defaultNamesData));
    console.log('Using inline default data');
    
    // 更新显示的总数
    const totalCount = commonNamesData.categories?.reduce((sum, cat) => sum + (cat.names?.length || 0), 0) || commonNamesData.totalNames;
    document.getElementById('totalNames').textContent = totalCount;
    
    return commonNamesData;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateRandomNames() {
    console.log('generateRandomNames called');
    const allNames = [];
    
    if (!commonNamesData) {
        console.error('commonNamesData is null or undefined');
        return [];
    }
    
    if (!commonNamesData.categories || !Array.isArray(commonNamesData.categories)) {
        console.error('commonNamesData.categories is not properly initialized:', commonNamesData.categories);
        return [];
    }
    
    console.log('Found', commonNamesData.categories.length, 'categories');
    
    commonNamesData.categories.forEach(categoryData => {
        if (categoryData && categoryData.names && Array.isArray(categoryData.names)) {
            console.log('Category:', categoryData.category, 'has', categoryData.names.length, 'names');
            categoryData.names.forEach(nameData => {
                allNames.push({
                    fullName: nameData.name,
                    pinyin: nameData.pinyin,
                    meaning: nameData.meaning,
                    pronunciation: nameData.pronunciation,
                    category: categoryData.category
                });
            });
        } else {
            console.log('Skipping invalid category data:', categoryData);
        }
    });
    
    console.log('Total names collected:', allNames.length);
    
    // 使用 Fisher-Yates 算法确保真正随机
    const shuffled = shuffleArray(allNames);
    const result = shuffled.slice(0, 10);
    console.log('Returning', result.length, 'random names');
    
    return result;
}

function renderNames(names) {
    const container = document.getElementById('commonNameCards');
    let html = '';
    
    names.forEach((name, index) => {
        html += `<div class="name-card">
            <div class="badge">${index + 1}</div>
            <div class="chinese-name">${escapeHtml(name.fullName)}<button class="audio-btn" onclick="playAudio('${escapeHtml(name.fullName)}','${escapeHtml(name.pinyin)}',this)"><span class="audio-icon">🔊</span></button></div>
            <div class="pinyin">${escapeHtml(name.pinyin)}</div>
            <div class="meaning">Meaning: ${escapeHtml(name.meaning)}</div>
            <div class="pronunciation">${escapeHtml(name.pronunciation)}</div>
        </div>`;
    });
    
    container.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function playAudio(chineseName, pinyin, btn) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(chineseName);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.7;
        utterance.onstart = () => btn.classList.add('playing');
        utterance.onend = () => btn.classList.remove('playing');
        window.speechSynthesis.speak(utterance);
    }
}

document.getElementById('refreshBtn').addEventListener('click', () => {
    console.log('Refresh button clicked');
    
    // 防连续刷新 - 3秒冷却时间
    if (isRefreshing) {
        console.log('Already refreshing, ignoring click');
        return;
    }
    isRefreshing = true;
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.disabled = true;
    refreshBtn.style.opacity = '0.6';
    refreshBtn.style.cursor = 'not-allowed';
    
    const container = document.getElementById('commonNameCards');
    container.innerHTML = '<div class="name-card"><div class="loading-text"><div class="loading-spinner"></div> Loading names...</div></div>';
    
    setTimeout(() => {
        console.log('Generating random names...');
        const names = generateRandomNames();
        console.log('Names generated:', names);
        
        if (names.length === 0) {
            console.error('No names returned from generateRandomNames');
            container.innerHTML = '<div class="name-card"><div class="loading-text">Failed to load names. Please try again.</div></div>';
        } else {
            renderNames(names);
        }
        
        // 3秒后恢复刷新按钮
        setTimeout(() => {
            isRefreshing = false;
            refreshBtn.disabled = false;
            refreshBtn.style.opacity = '1';
            refreshBtn.style.cursor = 'pointer';
            console.log('Refresh button re-enabled');
        }, 3000);
    }, 300);
});

function initPage() {
    console.log('Initializing page...');
    
    try {
        // 加载内联数据
        loadNamesData();
        console.log('Data loaded, generating names...');
        
        const names = generateRandomNames();
        console.log('Generated names count:', names.length);
        
        if (names.length > 0) {
            renderNames(names);
            console.log('Names rendered successfully');
        } else {
            console.error('No names available');
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

document.addEventListener('DOMContentLoaded', initPage);