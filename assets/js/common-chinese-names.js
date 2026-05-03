let commonNamesData = null;
let isRefreshing = false;

// 中文名字数据
const defaultNamesData = {
    "totalNames": 220,
    "categories": [
        {
            "category": "Most Common Names",
            "names": [
                {"name": "张伟", "pinyin": "Zhāng Wěi", "meaning": "Great strength", "pronunciation": "Jang Way"},
                {"name": "李强", "pinyin": "Lǐ Qiáng", "meaning": "Strong and powerful", "pronunciation": "Lee Chiang"},
                {"name": "王伟", "pinyin": "Wáng Wěi", "meaning": "Great accomplishment", "pronunciation": "Wong Way"},
                {"name": "李伟", "pinyin": "Lǐ Wěi", "meaning": "Great power", "pronunciation": "Lee Way"},
                {"name": "李明", "pinyin": "Lǐ Míng", "meaning": "Bright dawn", "pronunciation": "Lee Ming"},
                {"name": "王磊", "pinyin": "Wáng Lěi", "meaning": "Rock solid", "pronunciation": "Wong Lui"},
                {"name": "刘洋", "pinyin": "Liú Yáng", "meaning": "Ocean willow", "pronunciation": "Lyoo Yang"},
                {"name": "张磊", "pinyin": "Zhāng Lěi", "meaning": "Strong foundation", "pronunciation": "Jang Lui"},
                {"name": "张军", "pinyin": "Zhāng Jūn", "meaning": "Military leader", "pronunciation": "Jang Gwan"},
                {"name": "王强", "pinyin": "Wáng Qiáng", "meaning": "Powerful king", "pronunciation": "Wong Chiang"},
                {"name": "李军", "pinyin": "Lǐ Jūn", "meaning": "Soldier", "pronunciation": "Lee Gwan"},
                {"name": "陈杰", "pinyin": "Chén Jié", "meaning": "Outstanding", "pronunciation": "Chen Kit"},
                {"name": "刘杰", "pinyin": "Liú Jié", "meaning": "Talented willow", "pronunciation": "Lyoo Kit"},
                {"name": "张勇", "pinyin": "Zhāng Yǒng", "meaning": "Brave and bold", "pronunciation": "Jang Yung"},
                {"name": "王勇", "pinyin": "Wáng Yǒng", "meaning": "Brave king", "pronunciation": "Wong Yung"},
                {"name": "李杰", "pinyin": "Lǐ Jié", "meaning": "Outstanding plum", "pronunciation": "Lee Kit"},
                {"name": "刘阳", "pinyin": "Liú Yáng", "meaning": "Sunny willow", "pronunciation": "Lyoo Yang"},
                {"name": "陈浩", "pinyin": "Chén Hào", "meaning": "Vast ocean", "pronunciation": "Chen Hou"},
                {"name": "周杰", "pinyin": "Zhōu Jié", "meaning": "Outstanding week", "pronunciation": "Jow Kit"},
                {"name": "赵磊", "pinyin": "Zhào Lěi", "meaning": "Bright rock", "pronunciation": "Jau Lui"},
                {"name": "吴勇", "pinyin": "Wú Yǒng", "meaning": "Brave warrior", "pronunciation": "Ng Yung"},
                {"name": "陈阳", "pinyin": "Chén Yáng", "meaning": "Sunny dawn", "pronunciation": "Chen Yang"},
                {"name": "黄磊", "pinyin": "Huáng Lěi", "meaning": "Yellow rock", "pronunciation": "Wong Lui"},
                {"name": "徐明", "pinyin": "Xú Míng", "meaning": "Bright rising", "pronunciation": "Chui Ming"},
                {"name": "孙强", "pinyin": "Sūn Qiáng", "meaning": "Strong grandson", "pronunciation": "Soon Chiang"},
                {"name": "胡军", "pinyin": "Hú Jūn", "meaning": "Protector", "pronunciation": "Wu Gwan"},
                {"name": "朱杰", "pinyin": "Zhū Jié", "meaning": "Outstanding pearl", "pronunciation": "Joo Kit"},
                {"name": "高磊", "pinyin": "Gāo Lěi", "meaning": "High rock", "pronunciation": "Ko Lui"},
                {"name": "林勇", "pinyin": "Lín Yǒng", "meaning": "Brave forest", "pronunciation": "Lam Yung"},
                {"name": "罗明", "pinyin": "Luó Míng", "meaning": "Bright net", "pronunciation": "Lo Ming"},
                {"name": "郑强", "pinyin": "Zhèng Qiáng", "meaning": "Strong government", "pronunciation": "Chung Chiang"},
                {"name": "梁军", "pinyin": "Liáng Jūn", "meaning": "Bridge warrior", "pronunciation": "Leung Gwan"},
                {"name": "谢杰", "pinyin": "Xiè Jié", "meaning": "Grateful hero", "pronunciation": "Tse Kit"},
                {"name": "宋磊", "pinyin": "Sòng Lěi", "meaning": "Rock song", "pronunciation": "Sung Lui"},
                {"name": "唐勇", "pinyin": "Táng Yǒng", "meaning": "Brave Tang", "pronunciation": "Tong Yung"},
                {"name": "许明", "pinyin": "Xǔ Míng", "meaning": "Bright promise", "pronunciation": "Hui Ming"},
                {"name": "韩强", "pinyin": "Hán Qiáng", "meaning": "Strong Korea", "pronunciation": "Hon Chiang"},
                {"name": "冯军", "pinyin": "Féng Jūn", "meaning": "Wind warrior", "pronunciation": "Fung Gwan"},
                {"name": "邓杰", "pinyin": "Dèng Jié", "meaning": "Outstanding lantern", "pronunciation": "Dang Kit"},
                {"name": "曹磊", "pinyin": "Cáo Lěi", "meaning": "Cao rock", "pronunciation": "Tsao Lui"},
                {"name": "彭勇", "pinyin": "Péng Yǒng", "meaning": "Brave Peng", "pronunciation": "Pang Yung"},
                {"name": "曾明", "pinyin": "Zēng Míng", "meaning": "Bright increase", "pronunciation": "Tsang Ming"},
                {"name": "蔡军", "pinyin": "Cài Jūn", "meaning": "Protector Cai", "pronunciation": "Choi Gwan"},
                {"name": "潘杰", "pinyin": "Pān Jié", "meaning": "Outstanding pan", "pronunciation": "Pun Kit"},
                {"name": "袁磊", "pinyin": "Yuán Lěi", "meaning": "Origin rock", "pronunciation": "Yuen Lui"},
                {"name": "蒋勇", "pinyin": "Jiǎng Yǒng", "meaning": "Brave river", "pronunciation": "Keung Yung"},
                {"name": "于强", "pinyin": "Yú Qiáng", "meaning": "Strong fish", "pronunciation": "Yoo Chiang"},
                {"name": "杜军", "pinyin": "Dù Jūn", "meaning": "Protector Du", "pronunciation": "Do Gwan"},
                {"name": "沈杰", "pinyin": "Shěn Jié", "meaning": "Outstanding deep", "pronunciation": "Sum Kit"},
                {"name": "丁磊", "pinyin": "Dīng Lěi", "meaning": "Rock nail", "pronunciation": "Ding Lui"},
                {"name": "魏勇", "pinyin": "Wèi Yǒng", "meaning": "Brave greatness", "pronunciation": "Way Yung"},
                {"name": "薛明", "pinyin": "Xuē Míng", "meaning": "Bright Xue", "pronunciation": "Sit Ming"},
                {"name": "叶强", "pinyin": "Yè Qiáng", "meaning": "Strong leaf", "pronunciation": "Yip Chiang"},
                {"name": "余杰", "pinyin": "Yú Jié", "meaning": "Outstanding remainder", "pronunciation": "Yu Kit"},
                {"name": "潘磊", "pinyin": "Pān Lěi", "meaning": "Pan rock", "pronunciation": "Pun Lui"},
                {"name": "戴勇", "pinyin": "Dài Yǒng", "meaning": "Brave wear", "pronunciation": "Taai Yung"},
                {"name": "夏明", "pinyin": "Xià Míng", "meaning": "Bright summer", "pronunciation": "Ha Ming"},
                {"name": "钟强", "pinyin": "Zhōng Qiáng", "meaning": "Strong bell", "pronunciation": "Chung Chiang"},
                {"name": "汪军", "pinyin": "Wāng Jūn", "meaning": "Protector Wang", "pronunciation": "Wong Gwan"},
                {"name": "田杰", "pinyin": "Tián Jié", "meaning": "Outstanding field", "pronunciation": "Tin Kit"},
                {"name": "任磊", "pinyin": "Rèn Lěi", "meaning": "Responsible rock", "pronunciation": "Yam Lui"},
                {"name": "姜勇", "pinyin": "Jiāng Yǒng", "meaning": "Brave ginger", "pronunciation": "Keung Yung"},
                {"name": "方明", "pinyin": "Fāng Míng", "meaning": "Bright square", "pronunciation": "Fong Ming"},
                {"name": "石强", "pinyin": "Shí Qiáng", "meaning": "Strong stone", "pronunciation": "Sek Chiang"},
                {"name": "姚军", "pinyin": "Yáo Jūn", "meaning": "Protector Yao", "pronunciation": "Yiu Gwan"},
                {"name": "金杰", "pinyin": "Jīn Jié", "meaning": "Outstanding gold", "pronunciation": "Kam Kit"},
                {"name": "陆磊", "pinyin": "Lù Lěi", "meaning": "Land rock", "pronunciation": "Luk Lui"},
                {"name": "谭勇", "pinyin": "Tán Yǒng", "meaning": "Brave talk", "pronunciation": "Tam Yung"},
                {"name": "廖明", "pinyin": "Liào Míng", "meaning": "Bright liao", "pronunciation": "Liu Ming"},
                {"name": "熊强", "pinyin": "Xióng Qiáng", "meaning": "Strong bear", "pronunciation": "Hung Chiang"},
                {"name": "陆杰", "pinyin": "Lù Jié", "meaning": "Outstanding land", "pronunciation": "Luk Kit"},
                {"name": "郝磊", "pinyin": "Hǎo Lěi", "meaning": "Good rock", "pronunciation": "Ho Lui"},
                {"name": "孔勇", "pinyin": "Kǒng Yǒng", "meaning": "Brave hole", "pronunciation": "Hung Yung"},
                {"name": "白明", "pinyin": "Bái Míng", "meaning": "Bright white", "pronunciation": "Pak Ming"},
                {"name": "崔强", "pinyin": "Cuī Qiáng", "meaning": "Strong Cui", "pronunciation": "Chui Chiang"},
                {"name": "康军", "pinyin": "Kāng Jūn", "meaning": "Healthy warrior", "pronunciation": "Hong Gwan"},
                {"name": "毛杰", "pinyin": "Máo Jié", "meaning": "Outstanding hair", "pronunciation": "Mau Kit"},
                {"name": "邱磊", "pinyin": "Qiū Lěi", "meaning": "Hill rock", "pronunciation": "Yau Lui"},
                {"name": "秦勇", "pinyin": "Qín Yǒng", "meaning": "Brave Qin", "pronunciation": "Chun Yung"},
                {"name": "江明", "pinyin": "Jiāng Míng", "meaning": "Bright river", "pronunciation": "Kong Ming"},
                {"name": "史强", "pinyin": "Shǐ Qiáng", "meaning": "Strong history", "pronunciation": "See Chiang"},
                {"name": "顾军", "pinyin": "Gù Jūn", "meaning": "Protector Gu", "pronunciation": "Kuk Gwan"},
                {"name": "侯杰", "pinyin": "Hóu Jié", "meaning": "Outstanding marquis", "pronunciation": "Hau Kit"},
                {"name": "孟磊", "pinyin": "Mèng Lěi", "meaning": "Dream rock", "pronunciation": "Mang Lui"},
                {"name": "程勇", "pinyin": "Chéng Yǒng", "meaning": "Brave journey", "pronunciation": "Ching Yung"},
                {"name": "温明", "pinyin": "Wēn Míng", "meaning": "Warm bright", "pronunciation": "Wan Ming"},
                {"name": "安军", "pinyin": "Ān Jūn", "meaning": "Peaceful warrior", "pronunciation": "On Gwan"},
                {"name": "颜杰", "pinyin": "Yán Jié", "meaning": "Outstanding face", "pronunciation": "Ngan Kit"},
                {"name": "童磊", "pinyin": "Tóng Lěi", "meaning": "Child rock", "pronunciation": "Tung Lui"},
                {"name": "施勇", "pinyin": "Shī Yǒng", "meaning": "Brave apply", "pronunciation": "Si Yung"},
                {"name": "贺明", "pinyin": "Hè Míng", "meaning": "Bright celebration", "pronunciation": "Ho Ming"},
                {"name": "文强", "pinyin": "Wén Qiáng", "meaning": "Strong literature", "pronunciation": "Man Chiang"},
                {"name": "马明", "pinyin": "Mǎ Míng", "meaning": "Bright horse", "pronunciation": "Ma Ming"},
                {"name": "常军", "pinyin": "Cháng Jūn", "meaning": "Eternal warrior", "pronunciation": "Seung Gwan"},
                {"name": "樊磊", "pinyin": "Fán Lěi", "meaning": "Fence rock", "pronunciation": "Fan Lui"},
                {"name": "钱勇", "pinyin": "Qián Yǒng", "meaning": "Brave money", "pronunciation": "Chin Yung"},
                {"name": "谷明", "pinyin": "Gǔ Míng", "meaning": "Bright valley", "pronunciation": "Kuk Ming"},
                {"name": "盛强", "pinyin": "Shèng Qiáng", "meaning": "Strong prosperous", "pronunciation": "Sing Chiang"},
                {"name": "苗杰", "pinyin": "Miáo Jié", "meaning": "Outstanding seedling", "pronunciation": "Miu Kit"},
                {"name": "乔磊", "pinyin": "Qiáo Lěi", "meaning": "High rock", "pronunciation": "Kiu Lui"},
                {"name": "黄勇", "pinyin": "Huáng Yǒng", "meaning": "Brave yellow", "pronunciation": "Wong Yung"},
                {"name": "萧强", "pinyin": "Xiāo Qiáng", "meaning": "Strong Xiao", "pronunciation": "Siu Chiang"},
                {"name": "蔡明", "pinyin": "Cài Míng", "meaning": "Bright Cai", "pronunciation": "Choi Ming"},
                {"name": "阎军", "pinyin": "Yán Jūn", "meaning": "Protector Yan", "pronunciation": "Yim Gwan"},
                {"name": "金军", "pinyin": "Jīn Jūn", "meaning": "Golden warrior", "pronunciation": "Kam Gwan"},
                {"name": "芦强", "pinyin": "Lú Qiáng", "meaning": "Strong reed", "pronunciation": "Lou Chiang"},
                {"name": "管军", "pinyin": "Guǎn Jūn", "meaning": "Manager warrior", "pronunciation": "Gun Gwan"},
                {"name": "葛杰", "pinyin": "Gě Jié", "meaning": "Outstanding Ge", "pronunciation": "Got Kit"},
                {"name": "李涛", "pinyin": "Lǐ Tāo", "meaning": "Waves", "pronunciation": "Lee To"},
                {"name": "王明", "pinyin": "Wáng Míng", "meaning": "Bright king", "pronunciation": "Wong Ming"},
                {"name": "王俊杰", "pinyin": "Wáng Jùn Jié", "meaning": "Outstanding talent", "pronunciation": "Wong Jwan Kit"},
                {"name": "刘伟强", "pinyin": "Liú Wěi Qiáng", "meaning": "Powerful willow", "pronunciation": "Lyoo Way Chiang"},
                {"name": "张志强", "pinyin": "Zhāng Zhì Qiáng", "meaning": "Strong ambition", "pronunciation": "Jang Ji Chiang"},
                {"name": "李浩然", "pinyin": "Lǐ Hào Rán", "meaning": "Vast noble", "pronunciation": "Lee Hou Yin"},
                {"name": "陈宇轩", "pinyin": "Chén Yǔ Xuān", "meaning": "Elegant universe", "pronunciation": "Chen Yu Syun"},
                {"name": "王浩然", "pinyin": "Wáng Hào Rán", "meaning": "Vast king", "pronunciation": "Wong Hou Yin"},
                {"name": "刘俊杰", "pinyin": "Liú Jùn Jié", "meaning": "Talented willow", "pronunciation": "Lyoo Jwan Kit"},
                {"name": "张俊杰", "pinyin": "Zhāng Jùn Jié", "meaning": "Talented strength", "pronunciation": "Jang Jwan Kit"},
                {"name": "李思远", "pinyin": "Lǐ Sī Yuǎn", "meaning": "Far thought", "pronunciation": "Lee See Yuen"},
                {"name": "王宇航", "pinyin": "Wáng Yǔ Háng", "meaning": "Space travel", "pronunciation": "Wong Yu Hong"},
                {"name": "陈俊豪", "pinyin": "Chén Jùn Háo", "meaning": "Handsome hero", "pronunciation": "Chen Jwan Ho"},
                {"name": "黄志强", "pinyin": "Huáng Zhì Qiáng", "meaning": "Yellow ambition", "pronunciation": "Wong Ji Chiang"},
                {"name": "吴浩然", "pinyin": "Wú Hào Rán", "meaning": "Vast warrior", "pronunciation": "Ng Hou Yin"},
                {"name": "周俊杰", "pinyin": "Zhōu Jùn Jié", "meaning": "Talented week", "pronunciation": "Jow Jwan Kit"},
                {"name": "郑志伟", "pinyin": "Zhèng Zhì Wěi", "meaning": "Ambition greatness", "pronunciation": "Chung Ji Way"},
                {"name": "赵天宇", "pinyin": "Zhào Tiān Yǔ", "meaning": "Heaven universe", "pronunciation": "Jau Tin Yu"},
                {"name": "孙博文", "pinyin": "Sūn Bó Wén", "meaning": "Broad literature", "pronunciation": "Soon Pok Man"},
                {"name": "马俊杰", "pinyin": "Mǎ Jùn Jié", "meaning": "Talented horse", "pronunciation": "Ma Jwan Kit"},
                {"name": "朱志强", "pinyin": "Zhū Zhì Qiáng", "meaning": "Pearl ambition", "pronunciation": "Joo Ji Chiang"},
                {"name": "胡浩然", "pinyin": "Hú Hào Rán", "meaning": "Vast Hu", "pronunciation": "Wu Hou Yin"},
                {"name": "林宇轩", "pinyin": "Lín Yǔ Xuān", "meaning": "Forest elegance", "pronunciation": "Lam Yu Syun"},
                {"name": "郭文杰", "pinyin": "Guō Wén Jié", "meaning": "Literary hero", "pronunciation": "Kwok Man Kit"},
                {"name": "何俊辉", "pinyin": "Hé Jùn Huī", "meaning": "Bright talent", "pronunciation": "Ho Jwan Fai"},
                {"name": "高志远", "pinyin": "Gāo Zhì Yuǎn", "meaning": "High ambition", "pronunciation": "Ko Ji Yuen"},
                {"name": "罗浩然", "pinyin": "Luó Hào Rán", "meaning": "Vast net", "pronunciation": "Lo Hou Yin"},
                {"name": "梁俊杰", "pinyin": "Liáng Jùn Jié", "meaning": "Bridge talent", "pronunciation": "Leung Jwan Kit"},
                {"name": "宋子豪", "pinyin": "Sòng Zǐ Háo", "meaning": "Son hero", "pronunciation": "Sung Tzi Ho"},
                {"name": "唐志强", "pinyin": "Táng Zhì Qiáng", "meaning": "Tang ambition", "pronunciation": "Tong Ji Chiang"},
                {"name": "许嘉明", "pinyin": "Xǔ Jiā Míng", "meaning": "Bright praise", "pronunciation": "Hui Ka Ming"},
                {"name": "韩博文", "pinyin": "Hán Bó Wén", "meaning": "Korean scholar", "pronunciation": "Hon Pok Man"},
                {"name": "邓俊杰", "pinyin": "Dèng Jùn Jié", "meaning": "Lantern talent", "pronunciation": "Dang Jwan Kit"},
                {"name": "曹宇恒", "pinyin": "Cáo Yǔ Héng", "meaning": "Constant universe", "pronunciation": "Tsao Yu Hang"},
                {"name": "彭志豪", "pinyin": "Péng Zhì Háo", "meaning": "Ambition hero", "pronunciation": "Pang Ji Ho"},
                {"name": "曾建峰", "pinyin": "Zēng Jiàn Fēng", "meaning": "Build peak", "pronunciation": "Tsang Kin Fung"},
                {"name": "蔡明辉", "pinyin": "Cài Míng Huī", "meaning": "Bright radiance", "pronunciation": "Choi Ming Fai"},
                {"name": "潘俊宇", "pinyin": "Pān Jùn Yǔ", "meaning": "Talented universe", "pronunciation": "Pun Jwan Yu"},
                {"name": "袁志远", "pinyin": "Yuán Zhì Yuǎn", "meaning": "Origin ambition", "pronunciation": "Yuen Ji Yuen"},
                {"name": "蒋浩然", "pinyin": "Jiǎng Hào Rán", "meaning": "River vast", "pronunciation": "Keung Hou Yin"},
                {"name": "于子轩", "pinyin": "Yú Zǐ Xuān", "meaning": "Catalpa elegance", "pronunciation": "Yoo Tzi Syun"},
                {"name": "杜文轩", "pinyin": "Dù Wén Xuān", "meaning": "Literary elegance", "pronunciation": "Do Man Syun"},
                {"name": "沈俊杰", "pinyin": "Shěn Jùn Jié", "meaning": "Deep talent", "pronunciation": "Sum Jwan Kit"},
                {"name": "丁子恒", "pinyin": "Dīng Zǐ Héng", "meaning": "Constant nail", "pronunciation": "Ding Tzi Hang"},
                {"name": "魏志强", "pinyin": "Wèi Zhì Qiáng", "meaning": "Great ambition", "pronunciation": "Way Ji Chiang"},
                {"name": "薛博文", "pinyin": "Xuē Bó Wén", "meaning": "Xue scholar", "pronunciation": "Sit Pok Man"},
                {"name": "叶俊峰", "pinyin": "Yè Jùn Fēng", "meaning": "Leaf peak", "pronunciation": "Yip Jwan Fung"},
                {"name": "阎浩然", "pinyin": "Yán Hào Rán", "meaning": "Yan vast", "pronunciation": "Yim Hou Yin"},
                {"name": "余志明", "pinyin": "Yú Zhì Míng", "meaning": "Bright ambition", "pronunciation": "Yu Ji Ming"},
                {"name": "戴俊杰", "pinyin": "Dài Jùn Jié", "meaning": "Wear talent", "pronunciation": "Taai Jwan Kit"},
                {"name": "夏宇泽", "pinyin": "Xià Yǔ Zé", "meaning": "Summer blessing", "pronunciation": "Ha Yu Chak"},
                {"name": "钟志豪", "pinyin": "Zhōng Zhì Háo", "meaning": "Bell ambition", "pronunciation": "Chung Ji Ho"},
                {"name": "汪文杰", "pinyin": "Wāng Wén Jié", "meaning": "Literary Wang", "pronunciation": "Wong Man Kit"},
                {"name": "田俊辉", "pinyin": "Tián Jùn Huī", "meaning": "Field brightness", "pronunciation": "Tin Jwan Fai"},
                {"name": "任致远", "pinyin": "Rèn Zhì Yuǎn", "meaning": "Far ambition", "pronunciation": "Yam Ji Yuen"},
                {"name": "姜博文", "pinyin": "Jiāng Bó Wén", "meaning": "Ginger scholar", "pronunciation": "Keung Pok Man"},
                {"name": "方俊杰", "pinyin": "Fāng Jùn Jié", "meaning": "Square talent", "pronunciation": "Fong Jwan Kit"},
                {"name": "石宇轩", "pinyin": "Shí Yǔ Xuān", "meaning": "Stone elegance", "pronunciation": "Sek Yu Syun"},
                {"name": "姚志强", "pinyin": "Yáo Zhì Qiáng", "meaning": "Yao ambition", "pronunciation": "Yiu Ji Chiang"},
                {"name": "金俊明", "pinyin": "Jīn Jùn Míng", "meaning": "Golden bright", "pronunciation": "Kam Jwan Ming"},
                {"name": "陆文宇", "pinyin": "Lù Wén Yǔ", "meaning": "Land literature", "pronunciation": "Luk Man Yu"},
                {"name": "谭志远", "pinyin": "Tán Zhì Yuǎn", "meaning": "Talk ambition", "pronunciation": "Tam Ji Yuen"},
                {"name": "廖俊杰", "pinyin": "Liào Jùn Jié", "meaning": "Liao talent", "pronunciation": "Liu Jwan Kit"},
                {"name": "熊浩然", "pinyin": "Xióng Hào Rán", "meaning": "Bear vast", "pronunciation": "Hung Hou Yin"},
                {"name": "金宇辰", "pinyin": "Jīn Yǔ Chén", "meaning": "Golden time", "pronunciation": "Kam Yu San"},
                {"name": "陆俊豪", "pinyin": "Lù Jùn Háo", "meaning": "Land hero", "pronunciation": "Luk Jwan Ho"},
                {"name": "郝明轩", "pinyin": "Hǎo Míng Xuān", "meaning": "Good elegance", "pronunciation": "Ho Ming Syun"},
                {"name": "孔志伟", "pinyin": "Kǒng Zhì Wěi", "meaning": "Kong ambition", "pronunciation": "Hung Ji Way"},
                {"name": "白俊峰", "pinyin": "Bái Jùn Fēng", "meaning": "White peak", "pronunciation": "Pak Jwan Fung"},
                {"name": "崔浩然", "pinyin": "Cuī Hào Rán", "meaning": "Cui vast", "pronunciation": "Chui Hou Yin"},
                {"name": "康志豪", "pinyin": "Kāng Zhì Háo", "meaning": "Health hero", "pronunciation": "Hong Ji Ho"},
                {"name": "毛俊杰", "pinyin": "Máo Jùn Jié", "meaning": "Hair talent", "pronunciation": "Mau Jwan Kit"},
                {"name": "邱博文", "pinyin": "Qiū Bó Wén", "meaning": "Hill scholar", "pronunciation": "Yau Pok Man"},
                {"name": "秦宇泽", "pinyin": "Qín Yǔ Zé", "meaning": "Qin blessing", "pronunciation": "Chun Yu Chak"},
                {"name": "江志明", "pinyin": "Jiāng Zhì Míng", "meaning": "River bright", "pronunciation": "Kong Ji Ming"},
                {"name": "史俊辉", "pinyin": "Shǐ Jùn Huī", "meaning": "History brightness", "pronunciation": "See Jwan Fai"},
                {"name": "顾文杰", "pinyin": "Gù Wén Jié", "meaning": "Gu literary", "pronunciation": "Kuk Man Kit"},
                {"name": "侯志远", "pinyin": "Hóu Zhì Yuǎn", "meaning": "Marquis ambition", "pronunciation": "Hau Ji Yuen"},
                {"name": "孟浩然", "pinyin": "Mèng Hào Rán", "meaning": "Dream vast", "pronunciation": "Mang Hou Yin"},
                {"name": "程俊杰", "pinyin": "Chéng Jùn Jié", "meaning": "Journey talent", "pronunciation": "Ching Jwan Kit"},
                {"name": "温明轩", "pinyin": "Wēn Míng Xuān", "meaning": "Warm elegance", "pronunciation": "Wan Ming Syun"},
                {"name": "安博文", "pinyin": "Ān Bó Wén", "meaning": "Peace scholar", "pronunciation": "On Pok Man"},
                {"name": "颜志豪", "pinyin": "Yán Zhì Háo", "meaning": "Face hero", "pronunciation": "Ngan Ji Ho"},
                {"name": "童俊宇", "pinyin": "Tóng Jùn Yǔ", "meaning": "Child universe", "pronunciation": "Tung Jwan Yu"},
                {"name": "施文杰", "pinyin": "Shī Wén Jié", "meaning": "Apply literary", "pronunciation": "Si Man Kit"},
                {"name": "贺致远", "pinyin": "Hè Zhì Yuǎn", "meaning": "Celebration far", "pronunciation": "Ho Ji Yuen"},
                {"name": "文俊辉", "pinyin": "Wén Jùn Huī", "meaning": "Literature brightness", "pronunciation": "Man Jwan Fai"},
                {"name": "管浩然", "pinyin": "Guǎn Hào Rán", "meaning": "Manager vast", "pronunciation": "Gun Hou Yin"},
                {"name": "乔志明", "pinyin": "Qiáo Zhì Míng", "meaning": "High bright", "pronunciation": "Kiu Ji Ming"},
                {"name": "樊俊峰", "pinyin": "Fán Jùn Fēng", "meaning": "Fence peak", "pronunciation": "Fan Jwan Fung"},
                {"name": "钱宇轩", "pinyin": "Qián Yǔ Xuān", "meaning": "Money elegance", "pronunciation": "Chin Yu Syun"},
                {"name": "谷博文", "pinyin": "Gǔ Bó Wén", "meaning": "Valley scholar", "pronunciation": "Kuk Pok Man"},
                {"name": "盛志强", "pinyin": "Shèng Zhì Qiáng", "meaning": "Prosper ambition", "pronunciation": "Sing Ji Chiang"},
                {"name": "苗俊杰", "pinyin": "Miáo Jùn Jié", "meaning": "Seedling talent", "pronunciation": "Miu Jwan Kit"},
                {"name": "邢志远", "pinyin": "Xíng Zhì Yuǎn", "meaning": "Punishment far", "pronunciation": "Hang Ji Yuen"},
                {"name": "俞明辉", "pinyin": "Yú Míng Huī", "meaning": "Bright radiance", "pronunciation": "Yu Ming Fai"},
                {"name": "骆浩然", "pinyin": "Luò Hào Rán", "meaning": "Luo vast", "pronunciation": "Lok Hou Yin"},
                {"name": "岑俊宇", "pinyin": "Cén Jùn Yǔ", "meaning": "Cen universe", "pronunciation": "Sam Jwan Yu"},
                {"name": "房文杰", "pinyin": "Fáng Wén Jié", "meaning": "House literary", "pronunciation": "Fong Man Kit"},
                {"name": "焦志明", "pinyin": "Jiāo Zhì Míng", "meaning": "Anxious bright", "pronunciation": "Chiu Ji Ming"},
                {"name": "陶博文", "pinyin": "Táo Bó Wén", "meaning": "Pottery scholar", "pronunciation": "To Pok Man"},
                {"name": "翁俊豪", "pinyin": "Wēng Jùn Háo", "meaning": "Handsome hero", "pronunciation": "Wung Jwan Ho"}
            ]
        }
    ]
};

const fallbackData = defaultNamesData;

function loadNamesData(forceReload = false) {
    console.log('loadNamesData called, forceReload:', forceReload, 'commonNamesData exists:', commonNamesData !== null);
    
    if (commonNamesData && !forceReload) {
        console.log('Returning cached data');
        const totalCount = commonNamesData.categories?.reduce((sum, cat) => sum + (cat.names?.length || 0), 0) || commonNamesData.totalNames;
        document.getElementById('totalNames').textContent = totalCount;
        return commonNamesData;
    }
    
    commonNamesData = JSON.parse(JSON.stringify(defaultNamesData));
    console.log('Using inline default data');
    
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