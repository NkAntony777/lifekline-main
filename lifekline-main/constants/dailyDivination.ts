/**
 * 紫微斗数星曜接口
 */
export interface ZiweiStar {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'minor';
  element?: string;
  yinYang?: string;
  description?: string;
  nature?: string;
  effect?: string;
}

/**
 * 十四主星
 */
export const MAIN_STARS: ZiweiStar[] = [
  {
    id: 'ziwei',
    name: '紫微',
    type: 'main',
    element: '土',
    yinYang: '阴',
    description: '帝座，尊贵之星，为诸星之首',
    nature: '尊贵、权威、领导力',
    effect: '主贵气、权势、领导力，喜入命宫、身宫'
  },
  {
    id: 'tianji',
    name: '天机',
    type: 'main',
    element: '木',
    yinYang: '阴',
    description: '智慧之星，主聪明机变',
    nature: '智慧、机敏、变动',
    effect: '主智慧、谋略、变动，宜从策划、参谋之职'
  },
  {
    id: 'taiyang',
    name: '太阳',
    type: 'main',
    element: '火',
    yinYang: '阳',
    description: '官贵之星，主光明正大',
    nature: '光明、热情、博爱',
    effect: '主贵气、名声、官禄，喜照命身宫'
  },
  {
    id: 'wuqu',
    name: '武曲',
    type: 'main',
    element: '金',
    yinYang: '阴',
    description: '财星，主财富与武功',
    nature: '刚毅、果决、财富',
    effect: '主财运、武职、实业，为财星之首'
  },
  {
    id: 'tiantong',
    name: '天同',
    type: 'main',
    element: '水',
    yinYang: '阳',
    description: '福星，主享乐与平和',
    nature: '温和、懒散、福厚',
    effect: '主福气、享受、人缘，少年不利，中晚年福厚'
  },
  {
    id: 'lianzhen',
    name: '廉贞',
    type: 'main',
    element: '火',
    yinYang: '阴',
    description: '次桃花星，主感情与事业',
    nature: '刚强、风流、事业心强',
    effect: '主官禄、感情、事业，亦正亦邪'
  },
  {
    id: 'tianfu',
    name: '天府',
    type: 'main',
    element: '土',
    yinYang: '阳',
    description: '令星，主财库与稳定',
    nature: '稳重、保守、财库',
    effect: '主财库、稳定、保守，为财帛主'
  },
  {
    id: 'taiyin',
    name: '太阴',
    type: 'main',
    element: '水',
    yinYang: '阴',
    description: '财星，主田宅与财富',
    nature: '温柔、内敛、财富',
    effect: '主田宅、财富、女性，夜生人吉'
  },
  {
    id: 'tanlang',
    name: '贪狼',
    type: 'main',
    element: '木',
    yinYang: '阳',
    description: '大桃花星，主欲望与才艺',
    nature: '多才多艺、欲望强、桃花',
    effect: '主才艺、桃花、欲望，亦正亦邪'
  },
  {
    id: 'jumen',
    name: '巨门',
    type: 'main',
    element: '水',
    yinYang: '阴',
    description: '暗星，主口才与是非',
    nature: '口才、是非、暗昧',
    effect: '主口才、是非、暗昧，宜从事律师、教师'
  },
  {
    id: 'tianxiang',
    name: '天相',
    type: 'main',
    element: '水',
    yinYang: '阳',
    description: '印星，主印绶与衣食',
    nature: '稳重、服务、衣食',
    effect: '主衣食、服务、稳重，为佐曜之首'
  },
  {
    id: 'tianliang',
    name: '天梁',
    type: 'main',
    element: '土',
    yinYang: '阳',
    description: '荫星，主福寿与解厄',
    nature: '正直、福寿、解厄',
    effect: '主福寿、解厄、宗教，有逢凶化吉之能'
  },
  {
    id: 'qisha',
    name: '七杀',
    type: 'main',
    element: '金',
    yinYang: '阴',
    description: '将星，主威权与开创',
    nature: '刚烈、威权、开创',
    effect: '主威权、开创、冒险，宜从武职、创业'
  },
  {
    id: 'pojun',
    name: '破军',
    type: 'main',
    element: '水',
    yinYang: '阴',
    description: '耗星，主破坏与开创',
    nature: '开创、破坏、变动',
    effect: '主开创、破坏、变动，先破后成'
  }
];

/**
 * 十四副星（左右昌曲魁钺禄马羊陀火铃空劫）
 */
export const SECONDARY_STARS: ZiweiStar[] = [
  {
    id: 'zuofu',
    name: '左辅',
    type: 'secondary',
    element: '土',
    yinYang: '阳',
    description: '辅佐之星，主助力与贵人',
    nature: '助力、辅佐、稳重',
    effect: '主助力、贵人、辅佐，男命吉'
  },
  {
    id: 'youbi',
    name: '右弼',
    type: 'secondary',
    element: '水',
    yinYang: '阴',
    description: '辅佐之星，主助力与桃花',
    nature: '助力、桃花、灵活',
    effect: '主助力、桃花、辅佐，女命吉'
  },
  {
    id: 'wenchang',
    name: '文昌',
    type: 'secondary',
    element: '金',
    yinYang: '阳',
    description: '文星，主文采与科甲',
    nature: '文采、科甲、功名',
    effect: '主文采、功名、科甲，喜入命迁宫'
  },
  {
    id: 'wenqu',
    name: '文曲',
    type: 'secondary',
    element: '水',
    yinYang: '阴',
    description: '文星，主才艺与桃花',
    nature: '才艺、口才、桃花',
    effect: '主才艺、口才、桃花，喜入命迁宫'
  },
  {
    id: 'tiankui',
    name: '天魁',
    type: 'secondary',
    element: '火',
    yinYang: '阳',
    description: '贵人星，主阳贵与助力',
    nature: '贵人、助力、名声',
    effect: '主阳贵、助力、名声，昼生人吉'
  },
  {
    id: 'tianyue',
    name: '天钺',
    type: 'secondary',
    element: '火',
    yinYang: '阴',
    description: '贵人星，主阴贵与助力',
    nature: '贵人、助力、阴柔',
    effect: '主阴贵、助力、姻缘，夜生人吉'
  },
  {
    id: 'lucun',
    name: '禄存',
    type: 'secondary',
    element: '土',
    yinYang: '阴',
    description: '财星，主俸禄与财富',
    nature: '财富、保守、积蓄',
    effect: '主俸禄、财富、积蓄，最喜入财帛宫'
  },
  {
    id: 'tianma',
    name: '天马',
    type: 'secondary',
    element: '火',
    yinYang: '阳',
    description: '动星，主变动与远行',
    nature: '变动、远行、奔波',
    effect: '主变动、远行、迁移，喜与禄存同宫'
  },
  {
    id: 'qingyang',
    name: '擎羊',
    type: 'secondary',
    element: '金',
    yinYang: '阳',
    description: '煞星，主刑伤与冲突',
    nature: '刑伤、冲突、果决',
    effect: '主刑伤、冲突、手术，入庙反主权威'
  },
  {
    id: 'tuoluo',
    name: '陀罗',
    type: 'secondary',
    element: '金',
    yinYang: '阴',
    description: '煞星，主阻碍与拖延',
    nature: '阻碍、拖延、暗伤',
    effect: '主阻碍、拖延、暗疾，入庙反主谋略'
  },
  {
    id: 'huoxing',
    name: '火星',
    type: 'secondary',
    element: '火',
    yinYang: '阳',
    description: '煞星，主急躁与爆发',
    nature: '急躁、爆发、冲动',
    effect: '主急躁、爆发、意外，寅午戌宫入庙'
  },
  {
    id: 'lingxing',
    name: '铃星',
    type: 'secondary',
    element: '火',
    yinYang: '阴',
    description: '煞星，主阴沉与暗计',
    nature: '阴沉、暗计、 perseverance',
    effect: '主阴沉、暗计、毅力，巳酉丑宫入庙'
  },
  {
    id: 'dikong',
    name: '地空',
    type: 'secondary',
    element: '火',
    yinYang: '阴',
    description: '空星，主空亡与精神的',
    nature: '空亡、精神、放下',
    effect: '主空亡、精神、宗教，不利财运'
  },
  {
    id: 'dijie',
    name: '地劫',
    type: 'secondary',
    element: '火',
    yinYang: '阳',
    description: '劫星，主劫夺与破耗',
    nature: '劫夺、破耗、变动',
    effect: '主劫夺、破耗、变动，不利物质'
  }
];

/**
 * 杂曜（桃花星、孤克星、其他杂曜）
 */
export const MINOR_STARS: ZiweiStar[] = [
  // 桃花星
  {
    id: 'hongluan',
    name: '红鸾',
    type: 'minor',
    element: '水',
    yinYang: '阴',
    description: '正桃花星，主婚姻喜事',
    nature: '姻缘、喜庆、桃花',
    effect: '主婚姻、喜庆、姻缘，最喜入夫妻宫'
  },
  {
    id: 'tianxi',
    name: '天喜',
    type: 'minor',
    element: '水',
    yinYang: '阳',
    description: '正桃花星，主喜庆姻缘',
    nature: '喜庆、姻缘、生育',
    effect: '主喜庆、生育、姻缘，与红鸾对宫'
  },
  {
    id: 'tianyao',
    name: '天姚',
    type: 'minor',
    element: '水',
    yinYang: '阴',
    description: '次桃花星，主风流倜傥',
    nature: '风流、才艺、桃花',
    effect: '主风流、才艺、桃花，喜入命宫、福德宫'
  },
  {
    id: 'xianchi',
    name: '咸池',
    type: 'minor',
    element: '水',
    yinYang: '阴',
    description: '桃花煞，主酒色风流',
    nature: '酒色、风流、欲望',
    effect: '主酒色、风流、欲望，亦主才艺'
  },
  {
    id: 'dalian',
    name: '大耗',
    type: 'minor',
    element: '火',
    yinYang: '阳',
    description: '破耗星，主财物耗散',
    nature: '破耗、虚惊、损失',
    effect: '主财物耗散、虚惊、损失'
  },
  // 孤克星
  {
    id: 'guchen',
    name: '孤辰',
    type: 'minor',
    element: '火',
    yinYang: '阳',
    description: '孤克星，主孤独',
    nature: '孤独、清高、寂寞',
    effect: '主孤独、清高、不合群，男命忌入命宫'
  },
  {
    id: 'gusu',
    name: '寡宿',
    type: 'minor',
    element: '火',
    yinYang: '阴',
    description: '孤克星，主寡居',
    nature: '寡居、孤独、挑剔',
    effect: '主寡居、孤独、挑剔，女命忌入命宫'
  },
  {
    id: 'tianku',
    name: '天哭',
    type: 'minor',
    element: '火',
    yinYang: '阳',
    description: '忧伤星，主悲伤',
    nature: '悲伤、忧愁、劳碌',
    effect: '主悲伤、忧愁、劳碌，喜与吉星同宫'
  },
  {
    id: 'tianxu',
    name: '天虚',
    type: 'minor',
    element: '火',
    yinYang: '阴',
    description: '虚妄星，主空虚',
    nature: '空虚、虚假、不实',
    effect: '主空虚、虚假、精神不宁'
  },
  {
    id: 'longchi',
    name: '龙池',
    type: 'minor',
    element: '水',
    yinYang: '阳',
    description: '才华星，主才华',
    nature: '才华、清秀、文雅',
    effect: '主才华、清秀、文雅，喜入命宫、身宫'
  },
  {
    id: 'fengge',
    name: '凤阁',
    type: 'minor',
    element: '土',
    yinYang: '阴',
    description: '才华星，主才艺',
    nature: '才艺、威仪、修饰',
    effect: '主才艺、威仪、修饰，与龙池对宫'
  },
  // 其他杂曜
  {
    id: 'taijie',
    name: '台辅',
    type: 'minor',
    element: '土',
    yinYang: '阳',
    description: '辅佐星，主助力',
    nature: '助力、辅佐、稳重',
    effect: '主助力、辅佐、稳重'
  },
  {
    id: 'fenggao',
    name: '封诰',
    type: 'minor',
    element: '土',
    yinYang: '阴',
    description: '封赠星，主荣誉',
    nature: '荣誉、封赠、嘉奖',
    effect: '主荣誉、封赠、嘉奖'
  },
  {
    id: 'tianxian',
    name: '天刑',
    type: 'minor',
    element: '火',
    yinYang: '阳',
    description: '刑克星，主刑伤',
    nature: '刑伤、医药、宗教',
    effect: '主刑伤、医药、宗教，宜从医、法务'
  },
  {
    id: 'tianyue_star',
    name: '天月',
    type: 'minor',
    element: '火',
    yinYang: '阴',
    description: '病符星，主疾病',
    nature: '疾病、虚弱、健康',
    effect: '主疾病、虚弱、健康问题'
  },
  {
    id: 'yuede',
    name: '月德',
    type: 'minor',
    element: '火',
    yinYang: '阴',
    description: '德曜，主福德',
    nature: '福德、平安、化解',
    effect: '主福德、平安、化解灾厄'
  },
  {
    id: 'tiande',
    name: '天德',
    type: 'minor',
    element: '火',
    yinYang: '阳',
    description: '德曜，主福德',
    nature: '福德、贵人、化解',
    effect: '主福德、贵人、化解灾厄'
  },
  {
    id: 'tianwu',
    name: '天巫',
    type: 'minor',
    element: '土',
    yinYang: '阳',
    description: '宗教星，主宗教',
    nature: '宗教、灵感、传承',
    effect: '主宗教、灵感、技艺传承'
  },
  {
    id: 'tianfu_star',
    name: '天福',
    type: 'minor',
    element: '土',
    yinYang: '阳',
    description: '福星，主福气',
    nature: '福气、享受、安乐',
    effect: '主福气、享受、安乐'
  },
  {
    id: 'tianmi',
    name: '天秘',
    type: 'minor',
    element: '土',
    yinYang: '阴',
    description: '秘密星，主隐秘',
    nature: '隐秘、秘密、谋略',
    effect: '主隐秘、秘密、不为人知之事'
  }
];

/**
 * 六十四卦接口
 */
export interface ZhouyiGua {
  id: string;
  name: string;
  symbol: string;
  upperTrigram: string;  // 上卦
  lowerTrigram: string;  // 下卦
  upperName: string;     // 上卦名称
  lowerName: string;     // 下卦名称
  description: string;
  meaning: string;
  advice: string;
  element: string;
  number?: number;
  hexagram?: string;
}

/**
 * 六十四卦数组
 */
export const SIXTY_FOUR_GUA: ZhouyiGua[] = [
  // 乾宫八卦
  {
    id: 'qian',
    name: '乾',
    symbol: '☰',
    upperTrigram: '☰',
    lowerTrigram: '☰',
    upperName: '乾',
    lowerName: '乾',
    description: '元亨利贞。',
    meaning: '乾为天，象征天道刚健，自强不息。代表创始、亨通、有利、正固。大吉之象，主事业成功、名利双收。',
    advice: '宜积极进取，把握时机，自强不息。但不可骄傲自满，需谦虚谨慎。',
    element: '金',
    number: 1,
    hexagram: '䷀'
  },
  {
    id: 'kun',
    name: '坤',
    symbol: '☷',
    upperTrigram: '☷',
    lowerTrigram: '☷',
    upperName: '坤',
    lowerName: '坤',
    description: '元亨，利牝马之贞。',
    meaning: '坤为地，象征地道柔顺，厚德载物。代表包容、柔顺、承载。大吉之象，主柔顺得福、事业稳固。',
    advice: '宜柔顺守正，厚德载物，包容万物。不宜过于刚强，要以柔克刚。',
    element: '土',
    number: 2,
    hexagram: '䷁'
  },
  {
    id: 'zhun',
    name: '屯',
    symbol: '☳☵',
    upperTrigram: '☳',
    lowerTrigram: '☵',
    upperName: '震',
    lowerName: '坎',
    description: '元亨利贞，勿用有攸往，利建侯。',
    meaning: '水雷屯，象征万物初生，艰难始生。代表萌芽、困难、创业。虽有险阻，但充满希望。',
    advice: '宜守正待时，不可妄动。创业之初困难重重，需耐心积累，等待时机。',
    element: '水',
    number: 3,
    hexagram: '䷂'
  },
  {
    id: 'meng',
    name: '蒙',
    symbol: '☵☳',
    upperTrigram: '☵',
    lowerTrigram: '☳',
    upperName: '坎',
    lowerName: '震',
    description: '亨。匪我求童蒙，童蒙求我。',
    meaning: '山水蒙，象征蒙昧未开，需要启蒙。代表教育、学习、启蒙。主需要学习成长。',
    advice: '宜虚心学习，求师问道。不要自以为是，要主动求学，接受教导。',
    element: '土',
    number: 4,
    hexagram: '䷃'
  },
  {
    id: 'xu',
    name: '需',
    symbol: '☵☰',
    upperTrigram: '☵',
    lowerTrigram: '☰',
    upperName: '坎',
    lowerName: '乾',
    description: '有孚，光亨，贞吉。利涉大川。',
    meaning: '水天需，象征等待时机，耐心守候。代表等待、需求、期待。主等待时机，不可急躁。',
    advice: '宜耐心等待，守正待时。凡事不可强求，时机成熟自然水到渠成。',
    element: '水',
    number: 5,
    hexagram: '䷄'
  },
  {
    id: 'song',
    name: '讼',
    symbol: '☰☵',
    upperTrigram: '☰',
    lowerTrigram: '☵',
    upperName: '乾',
    lowerName: '坎',
    description: '有孚，窒惕，中吉，终凶。',
    meaning: '天水讼，象征争讼纠纷，口舌是非。代表争讼、口舌、矛盾。主有争端，需谨慎处理。',
    advice: '宜化解争端，避免诉讼。凡事以和为贵，不可逞强好胜，以免两败俱伤。',
    element: '金',
    number: 6,
    hexagram: '䷅'
  },
  {
    id: 'shi',
    name: '师',
    symbol: '☵☷',
    upperTrigram: '☵',
    lowerTrigram: '☷',
    upperName: '坎',
    lowerName: '坤',
    description: '贞，丈人吉，无咎。',
    meaning: '地水师，象征军队出征，聚众而行。代表军队、组织、领导。主需要领导才能。',
    advice: '宜用人唯贤，严明纪律。作为领导者要以身作则，赏罚分明，才能服众。',
    element: '水',
    number: 7,
    hexagram: '䷆'
  },
  {
    id: 'bi',
    name: '比',
    symbol: '☷☵',
    upperTrigram: '☷',
    lowerTrigram: '☵',
    upperName: '坤',
    lowerName: '坎',
    description: '吉。原筮元永贞，无咎。',
    meaning: '水地比，象征亲密比辅，团结互助。代表亲近、团结、辅助。主团结互助，吉利。',
    advice: '宜亲近贤人，团结互助。选择良师益友，互相扶持，共同发展。',
    element: '土',
    number: 8,
    hexagram: '䷇'
  },
  // 震宫八卦
  {
    id: 'xiaoxu',
    name: '小畜',
    symbol: '☴☰',
    upperTrigram: '☴',
    lowerTrigram: '☰',
    upperName: '巽',
    lowerName: '乾',
    description: '亨。密云不雨，自我西郊。',
    meaning: '风天小畜，象征小有蓄积，力量不足。代表小有成就、暂时停顿。主小有收获但尚未大成。',
    advice: '宜蓄积力量，等待时机。凡事不可急躁，要积累实力，厚积薄发。',
    element: '木',
    number: 9,
    hexagram: '䷈'
  },
  {
    id: 'lv',
    name: '履',
    symbol: '☰☱',
    upperTrigram: '☰',
    lowerTrigram: '☱',
    upperName: '乾',
    lowerName: '兑',
    description: '履虎尾，不咥人，亨。',
    meaning: '天泽履，象征小心行走，谨慎行事。代表践行、谨慎、礼节。主谨慎行事，可保平安。',
    advice: '宜谨慎行事，遵循礼节。在危险环境中要小心谨慎，循规蹈矩才能安全。',
    element: '金',
    number: 10,
    hexagram: '䷉'
  },
  {
    id: 'tai',
    name: '泰',
    symbol: '☷☰',
    upperTrigram: '☷',
    lowerTrigram: '☰',
    upperName: '坤',
    lowerName: '乾',
    description: '小往大来，吉亨。',
    meaning: '地天泰，象征天地交泰，通顺安泰。代表通泰、安泰、吉祥。大吉之象，主事业顺利。',
    advice: '宜把握良机，顺势而进。时机大好，要积极进取，但也要防微杜渐。',
    element: '土',
    number: 11,
    hexagram: '䷊'
  },
  {
    id: 'pi',
    name: '否',
    symbol: '☰☷',
    upperTrigram: '☰',
    lowerTrigram: '☷',
    upperName: '乾',
    lowerName: '坤',
    description: '否之匪人，不利君子贞，大往小来。',
    meaning: '天地否，象征天地不交，闭塞不通。代表闭塞、困难、不顺。主时运不济，困难重重。',
    advice: '宜守正待时，韬光养晦。在困难时期要低调行事，等待时机转好。',
    element: '金',
    number: 12,
    hexagram: '䷋'
  },
  {
    id: 'tongren',
    name: '同人',
    symbol: '☰☲',
    upperTrigram: '☰',
    lowerTrigram: '☲',
    upperName: '乾',
    lowerName: '离',
    description: '同人于野，亨。利涉大川，利君子贞。',
    meaning: '天火同人，象征与人和同，团结一致。代表团结、合作、志同道合。主人际和谐，可成大事。',
    advice: '宜团结合作，求同存异。与志同道合者共同奋斗，可成大事。',
    element: '火',
    number: 13,
    hexagram: '䷌'
  },
  {
    id: 'dayou',
    name: '大有',
    symbol: '☲☰',
    upperTrigram: '☲',
    lowerTrigram: '☰',
    upperName: '离',
    lowerName: '乾',
    description: '元亨。',
    meaning: '火天大有，象征大有收获，丰盛富足。代表富有、成功、丰盛。大吉之象，主大有所获。',
    advice: '宜谦逊守正，不可骄奢。即使大有收获也要保持谦虚，施惠于人。',
    element: '火',
    number: 14,
    hexagram: '䷍'
  },
  {
    id: 'qian_gua',
    name: '谦',
    symbol: '☷☶',
    upperTrigram: '☷',
    lowerTrigram: '☶',
    upperName: '坤',
    lowerName: '艮',
    description: '亨，君子有终。',
    meaning: '地山谦，象征谦虚谨慎，品德高尚。代表谦虚、谦逊、退让。大吉之象，唯一六爻皆吉。',
    advice: '宜谦虚谨慎，礼让待人。谦虚是最高美德，凡事谦虚必获吉祥。',
    element: '土',
    number: 15,
    hexagram: '䷎'
  },
  {
    id: 'yu',
    name: '豫',
    symbol: '☳☷',
    upperTrigram: '☳',
    lowerTrigram: '☷',
    upperName: '震',
    lowerName: '坤',
    description: '利建侯行师。',
    meaning: '雷地豫，象征喜悦安乐，心旷神怡。代表喜悦、安乐、预备。主心情愉悦，但需防懈怠。',
    advice: '宜居安思危，不可懈怠。在安乐中要保持警觉，做好准备。',
    element: '木',
    number: 16,
    hexagram: '䷏'
  },
  // 离宫八卦
  {
    id: 'sui',
    name: '随',
    symbol: '☱☳',
    upperTrigram: '☱',
    lowerTrigram: '☳',
    upperName: '兑',
    lowerName: '震',
    description: '元亨利贞，无咎。',
    meaning: '泽雷随，象征随从、顺应、跟随。代表随从、顺应、随和。主顺应时势，随机应变。',
    advice: '宜顺应时势，择善而从。要跟随正道，选择良师益友，不可盲从。',
    element: '金',
    number: 17,
    hexagram: '䷐'
  },
  {
    id: 'gu',
    name: '蛊',
    symbol: '☶☴',
    upperTrigram: '☶',
    lowerTrigram: '☴',
    upperName: '艮',
    lowerName: '巽',
    description: '元亨，利涉大川。先甲三日，后甲三日。',
    meaning: '山风蛊，象征腐败、蛊惑、整治。代表腐败、混乱、改革。主需要改革除弊。',
    advice: '宜改革除弊，振衰起敝。发现问题要及时整治，拨乱反正。',
    element: '木',
    number: 18,
    hexagram: '䷑'
  },
  {
    id: 'lin',
    name: '临',
    symbol: '☷☱',
    upperTrigram: '☷',
    lowerTrigram: '☱',
    upperName: '坤',
    lowerName: '兑',
    description: '元，亨，利，贞。至于八月有凶。',
    meaning: '地泽临，象征临近、督导、君临。代表临近、督导、上位。主德泽施于下，吉利。',
    advice: '宜教民育民，以德服人。作为领导者要体恤下属，施恩于民。',
    element: '土',
    number: 19,
    hexagram: '䷒'
  },
  {
    id: 'guan',
    name: '观',
    symbol: '☴☷',
    upperTrigram: '☴',
    lowerTrigram: '☷',
    upperName: '巽',
    lowerName: '坤',
    description: '盥而不荐，有孚颙若。',
    meaning: '风地观，象征观瞻、观察、示范。代表观察、示范、展示。主以德行示人。',
    advice: '宜以身作则，示范于人。自己的言行是别人的榜样，要谨慎。',
    element: '木',
    number: 20,
    hexagram: '䷓'
  },
  {
    id: 'shihe',
    name: '噬嗑',
    symbol: '☲☳',
    upperTrigram: '☲',
    lowerTrigram: '☳',
    upperName: '离',
    lowerName: '震',
    description: '亨。利用狱。',
    meaning: '火雷噬嗑，象征咬合、刑罚、制裁。代表刑罚、制裁、决断。主用刑罚除去障碍。',
    advice: '宜明断是非，铲除障碍。遇到困难要果断处理，去除障碍。',
    element: '火',
    number: 21,
    hexagram: '䷔'
  },
  {
    id: 'bi_gua',
    name: '贲',
    symbol: '☶☲',
    upperTrigram: '☶',
    lowerTrigram: '☲',
    upperName: '艮',
    lowerName: '离',
    description: '亨。小利有所往。',
    meaning: '山火贲，象征文饰、修饰、美丽。代表文饰、修饰、礼仪。主适当的文饰是吉利的。',
    advice: '宜文质彬彬，适可而止。适当的修饰可以，但不可过分追求表面。',
    element: '火',
    number: 22,
    hexagram: '䷕'
  },
  {
    id: 'bo',
    name: '剥',
    symbol: '☶☷',
    upperTrigram: '☶',
    lowerTrigram: '☷',
    upperName: '艮',
    lowerName: '坤',
    description: '不利有攸往。',
    meaning: '山地剥，象征剥落、衰败、侵蚀。代表衰败、剥落、小人得势。主运势衰退，需要谨慎。',
    advice: '宜守静待时，不可妄动。运势衰退时要低调自保，等待时机。',
    element: '土',
    number: 23,
    hexagram: '䷖'
  },
  {
    id: 'fu',
    name: '复',
    symbol: '☷☳',
    upperTrigram: '☷',
    lowerTrigram: '☳',
    upperName: '坤',
    lowerName: '震',
    description: '亨。出入无疾，朋来无咎。',
    meaning: '地雷复，象征回复、复兴、循环。代表恢复、复兴、转机。主阴极阳生，希望将至。',
    advice: '宜把握转机，积极行动。运势开始好转，要把握时机重新开始。',
    element: '土',
    number: 24,
    hexagram: '䷗'
  },
  // 巽宫八卦
  {
    id: 'wuwang',
    name: '无妄',
    symbol: '☰☳',
    upperTrigram: '☰',
    lowerTrigram: '☳',
    upperName: '乾',
    lowerName: '震',
    description: '元亨利贞。其匪正有眚，不利有攸往。',
    meaning: '天雷无妄，象征无妄之灾，不可妄动。代表无妄、真实、自然。主不可妄为，顺其自然。',
    advice: '宜顺其自然，不可妄动。要真诚待人，不可有虚妄之念。',
    element: '金',
    number: 25,
    hexagram: '䷘'
  },
  {
    id: 'daxu',
    name: '大畜',
    symbol: '☶☰',
    upperTrigram: '☶',
    lowerTrigram: '☰',
    upperName: '艮',
    lowerName: '乾',
    description: '利贞，不家食吉，利涉大川。',
    meaning: '山天大畜，象征大有蓄积，实力雄厚。代表蓄积、蓄养、等待。主实力充足，可成大事。',
    advice: '宜蓄积实力，待机而动。积累足够的力量后，可以大有作为。',
    element: '土',
    number: 26,
    hexagram: '䷙'
  },
  {
    id: 'yi',
    name: '颐',
    symbol: '☶☳',
    upperTrigram: '☶',
    lowerTrigram: '☳',
    upperName: '艮',
    lowerName: '震',
    description: '贞吉。观颐，自求口实。',
    meaning: '山雷颐，象征颐养、养生、自养。代表养生、养育、自食其力。主要懂得养生之道。',
    advice: '宜自食其力，谨言慎行。要懂得养生之道，言语饮食都要谨慎。',
    element: '木',
    number: 27,
    hexagram: '䷚'
  },
  {
    id: 'daguo',
    name: '大过',
    symbol: '☱☴',
    upperTrigram: '☱',
    lowerTrigram: '☴',
    upperName: '兑',
    lowerName: '巽',
    description: '栋桡，利有攸往，亨。',
    meaning: '泽风大过，象征大的过度，非常行动。代表过度、非常、危机。主非常时期需要非常手段。',
    advice: '宜非常行动，打破常规。在特殊情况下需要采取特殊措施。',
    element: '木',
    number: 28,
    hexagram: '䷛'
  },
  {
    id: 'kan',
    name: '坎',
    symbol: '☵☵',
    upperTrigram: '☵',
    lowerTrigram: '☵',
    upperName: '坎',
    lowerName: '坎',
    description: '习坎，有孚，维心亨，行有尚。',
    meaning: '坎为水，象征险陷、困难、考验。代表危险、考验、险阻。主困难重重，需要诚信。',
    advice: '宜保持诚信，谨慎行事。在困境中要保持信心，不可放弃。',
    element: '水',
    number: 29,
    hexagram: '䷜'
  },
  {
    id: 'li',
    name: '离',
    symbol: '☲☲',
    upperTrigram: '☲',
    lowerTrigram: '☲',
    upperName: '离',
    lowerName: '离',
    description: '利贞，亨。畜牝牛，吉。',
    meaning: '离为火，象征光明、依附、文明。代表光明、文明、美丽。主光明正大，依附正道。',
    advice: '宜光明正大，依附正道。要追求文明光明，选择正确的依附对象。',
    element: '火',
    number: 30,
    hexagram: '䷝'
  },
  {
    id: 'xian',
    name: '咸',
    symbol: '☱☶',
    upperTrigram: '☱',
    lowerTrigram: '☶',
    upperName: '兑',
    lowerName: '艮',
    description: '亨，利贞，取女吉。',
    meaning: '泽山咸，象征感应、交感、情感。代表感应、交感、婚姻。主以诚相感，感情融洽。',
    advice: '宜真诚相待，以心相感。感情需要真诚，不可虚伪造作。',
    element: '金',
    number: 31,
    hexagram: '䷞'
  },
  {
    id: 'heng',
    name: '恒',
    symbol: '☴☳',
    upperTrigram: '☴',
    lowerTrigram: '☳',
    upperName: '巽',
    lowerName: '震',
    description: '亨，无咎，利贞，利有攸往。',
    meaning: '雷风恒，象征恒久、持久、不变。代表恒久、持久、坚持。主持之以恒，方能成功。',
    advice: '宜持之以恒，坚持不懈。做事要有恒心，不可半途而废。',
    element: '木',
    number: 32,
    hexagram: '䷟'
  },
  // 艮宫八卦
  {
    id: 'dun',
    name: '遁',
    symbol: '☰☶',
    upperTrigram: '☰',
    lowerTrigram: '☶',
    upperName: '乾',
    lowerName: '艮',
    description: '亨，小利贞。',
    meaning: '天山遁，象征隐遁、退避、退让。代表退避、隐遁、避让。主宜退不宜进，保全为上。',
    advice: '宜知进退，适时隐退。时势不利时要懂得退避，保全自己。',
    element: '金',
    number: 33,
    hexagram: '䷠'
  },
  {
    id: 'dazhuang',
    name: '大壮',
    symbol: '☳☰',
    upperTrigram: '☳',
    lowerTrigram: '☰',
    upperName: '震',
    lowerName: '乾',
    description: '利贞。',
    meaning: '雷天大壮，象征大壮、强盛、壮盛。代表强盛、壮盛、刚健。主力量强盛，但需守正。',
    advice: '宜守正用壮，不可恃强凌弱。力量强大时要懂得约束，不可滥用。',
    element: '木',
    number: 34,
    hexagram: '䷡'
  },
  {
    id: 'jin',
    name: '晋',
    symbol: '☲☷',
    upperTrigram: '☲',
    lowerTrigram: '☷',
    upperName: '离',
    lowerName: '坤',
    description: '康侯用锡马蕃庶，昼日三接。',
    meaning: '火地晋，象征晋升、进步、光明。代表晋升、上进、光明。主事业上升，前途光明。',
    advice: '宜积极进取，把握时机。运势上升期要积极进取，但不可操之过急。',
    element: '火',
    number: 35,
    hexagram: '䷢'
  },
  {
    id: 'mingyi',
    name: '明夷',
    symbol: '☷☲',
    upperTrigram: '☷',
    lowerTrigram: '☲',
    upperName: '坤',
    lowerName: '离',
    description: '利艰贞。',
    meaning: '地火明夷，象征光明受伤，黑暗降临。代表受伤、黑暗、困难。主时运不济，需要忍耐。',
    advice: '宜韬光养晦，守正待时。在困难时期要隐藏才能，等待时机。',
    element: '土',
    number: 36,
    hexagram: '䷣'
  },
  {
    id: 'jiaren',
    name: '家人',
    symbol: '☴☲',
    upperTrigram: '☴',
    lowerTrigram: '☲',
    upperName: '巽',
    lowerName: '离',
    description: '利女贞。',
    meaning: '风火家人，象征家庭、家人、内政。代表家庭、伦理、亲情。主家庭和睦，凡事吉利。',
    advice: '宜家道端正，各守本分。家庭要各尽其责，长幼有序。',
    element: '木',
    number: 37,
    hexagram: '䷤'
  },
  {
    id: 'kui',
    name: '睽',
    symbol: '☲☱',
    upperTrigram: '☲',
    lowerTrigram: '☱',
    upperName: '离',
    lowerName: '兑',
    description: '小事吉。',
    meaning: '火泽睽，象征背离、分离、乖异。代表分离、矛盾、不和。主意见不合，需要协调。',
    advice: '宜求同存异，化解矛盾。即使意见不合，也要寻找共同点。',
    element: '火',
    number: 38,
    hexagram: '䷥'
  },
  {
    id: 'jian',
    name: '蹇',
    symbol: '☵☶',
    upperTrigram: '☵',
    lowerTrigram: '☶',
    upperName: '坎',
    lowerName: '艮',
    description: '利西南，不利东北；利见大人，贞吉。',
    meaning: '水山蹇，象征蹇难、困难、跛足。代表困难、险阻、艰难。主前行困难，需要帮助。',
    advice: '宜寻求帮助，见机而行。困难时要寻求贵人帮助，不可独自硬闯。',
    element: '水',
    number: 39,
    hexagram: '䷦'
  },
  {
    id: 'jie',
    name: '解',
    symbol: '☳☵',
    upperTrigram: '☳',
    lowerTrigram: '☵',
    upperName: '震',
    lowerName: '坎',
    description: '利西南，无所往，其来复吉。',
    meaning: '雷水解，象征解脱、缓解、释放。代表解脱、释放、放松。主困难解除，可以行动。',
    advice: '宜把握时机，解除困难。困难过去后要把握时机，恢复正常。',
    element: '木',
    number: 40,
    hexagram: '䷧'
  },
  // 兑宫八卦
  {
    id: 'sun',
    name: '损',
    symbol: '☶☱',
    upperTrigram: '☶',
    lowerTrigram: '☱',
    upperName: '艮',
    lowerName: '兑',
    description: '有孚，元吉，无咎，可贞，利有攸往。',
    meaning: '山泽损，象征减损、损失、舍己。代表减损、损失、付出。主有损失但也有收获。',
    advice: '宜损己利人，舍小得大。适当的付出和损失会带来更大的回报。',
    element: '土',
    number: 41,
    hexagram: '䷨'
  },
  {
    id: 'yi_gua',
    name: '益',
    symbol: '☴☱',
    upperTrigram: '☴',
    lowerTrigram: '☱',
    upperName: '巽',
    lowerName: '兑',
    description: '利有攸往，利涉大川。',
    meaning: '风泽益，象征增益、受益、帮助。代表增益、受益、进步。大吉之象，主获益良多。',
    advice: '宜积极进取，把握良机。运势大好，要积极进取，把握时机。',
    element: '木',
    number: 42,
    hexagram: '䷩'
  },
  {
    id: 'guai',
    name: '夬',
    symbol: '☱☰',
    upperTrigram: '☱',
    lowerTrigram: '☰',
    upperName: '兑',
    lowerName: '乾',
    description: '扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。',
    meaning: '泽天夬，象征决断、果断、去除。代表决断、去除、裁决。主果断决策，去除小人。',
    advice: '宜果断决策，去除小人。要果断处理问题，去除不利因素。',
    element: '金',
    number: 43,
    hexagram: '䷪'
  },
  {
    id: 'gou',
    name: '姤',
    symbol: '☰☴',
    upperTrigram: '☰',
    lowerTrigram: '☴',
    upperName: '乾',
    lowerName: '巽',
    description: '女壮，勿用取女。',
    meaning: '天风姤，象征相遇、邂逅、不期而遇。代表相遇、邂逅、意外。主不期而遇，需谨慎。',
    advice: '宜谨慎对待，防微杜渐。意外的相遇要谨慎处理，不可掉以轻心。',
    element: '金',
    number: 44,
    hexagram: '䷫'
  },
  {
    id: 'cui',
    name: '萃',
    symbol: '☱☷',
    upperTrigram: '☱',
    lowerTrigram: '☷',
    upperName: '兑',
    lowerName: '坤',
    description: '亨。王假有庙，利见大人，亨，利贞。',
    meaning: '泽地萃，象征聚集、荟萃、聚合。代表聚集、聚合、团结。主人群聚集，吉利。',
    advice: '宜团结聚集，共同奋斗。团结就是力量，要聚集志同道合者。',
    element: '金',
    number: 45,
    hexagram: '䷬'
  },
  {
    id: 'sheng',
    name: '升',
    symbol: '☷☴',
    upperTrigram: '☷',
    lowerTrigram: '☴',
    upperName: '坤',
    lowerName: '巽',
    description: '元亨，用见大人，勿恤，南征吉。',
    meaning: '地风升，象征上升、晋升、登高。代表上升、进步、发展。主事业上升，前途光明。',
    advice: '宜积极进取，顺势而升。运势上升期要积极进取，把握时机。',
    element: '土',
    number: 46,
    hexagram: '䷭'
  },
  {
    id: 'kun_gua',
    name: '困',
    symbol: '☵☱',
    upperTrigram: '☵',
    lowerTrigram: '☱',
    upperName: '坎',
    lowerName: '兑',
    description: '亨，贞，大人吉，无咎，有言不信。',
    meaning: '泽水困，象征困厄、困难、困境。代表困难、困厄、窘迫。主处于困境，需要坚持。',
    advice: '宜坚守正道，等待时机。困境中要坚守信念，等待转机。',
    element: '水',
    number: 47,
    hexagram: '䷮'
  },
  {
    id: 'jing',
    name: '井',
    symbol: '☴☵',
    upperTrigram: '☴',
    lowerTrigram: '☵',
    upperName: '巽',
    lowerName: '坎',
    description: '改邑不改井，无丧无得，往来井井。',
    meaning: '水风井，象征水井、源泉、养育。代表源泉、养育、持续。主源源不断，永续发展。',
    advice: '宜养民育民，持续不断。要像井水一样持续不断地滋养他人。',
    element: '木',
    number: 48,
    hexagram: '䷯'
  },
  // 坎宫八卦
  {
    id: 'ge',
    name: '革',
    symbol: '☱☲',
    upperTrigram: '☱',
    lowerTrigram: '☲',
    upperName: '兑',
    lowerName: '离',
    description: '己日乃孚，元亨利贞，悔亡。',
    meaning: '泽火革，象征变革、改革、革新。代表变革、改革、除旧布新。主时机成熟可以变革。',
    advice: '宜把握时机，果断变革。时机成熟时要果断改革，除旧布新。',
    element: '金',
    number: 49,
    hexagram: '䷰'
  },
  {
    id: 'ding',
    name: '鼎',
    symbol: '☲☱',
    upperTrigram: '☲',
    lowerTrigram: '☱',
    upperName: '离',
    lowerName: '兑',
    description: '元吉，亨。',
    meaning: '火风鼎，象征鼎新、稳定、文明。代表鼎新、稳定、成就。大吉之象，主事业有成。',
    advice: '宜稳定大局，守成创新。事业已成，要稳定大局，适当创新。',
    element: '火',
    number: 50,
    hexagram: '䷱'
  },
  {
    id: 'zhen',
    name: '震',
    symbol: '☳☳',
    upperTrigram: '☳',
    lowerTrigram: '☳',
    upperName: '震',
    lowerName: '震',
    description: '亨。震来虩虩，笑言哑哑。',
    meaning: '震为雷，象征震动、惊惧、行动。代表震动、惊惧、雷厉风行。主有惊无险，可以应对。',
    advice: '宜谨慎应对，转危为安。面对突发事件要保持镇定，妥善应对。',
    element: '木',
    number: 51,
    hexagram: '䷲'
  },
  {
    id: 'gen',
    name: '艮',
    symbol: '☶☶',
    upperTrigram: '☶',
    lowerTrigram: '☶',
    upperName: '艮',
    lowerName: '艮',
    description: '艮其背，不获其身，行其庭，不见其人，无咎。',
    meaning: '艮为山，象征停止、静止、止步。代表停止、静止、知止。主要懂得适可而止。',
    advice: '宜知止则止，不可妄动。要明白何时停止，不可贪得无厌。',
    element: '土',
    number: 52,
    hexagram: '䷳'
  },
  {
    id: 'jian_gua',
    name: '渐',
    symbol: '☴☶',
    upperTrigram: '☴',
    lowerTrigram: '☶',
    upperName: '巽',
    lowerName: '艮',
    description: '女归吉，利贞。',
    meaning: '风山渐，象征渐进、逐步、循序渐进。代表渐进、逐步、有序。主循序渐进，终有所成。',
    advice: '宜循序渐进，不可急躁。做事要循序渐进，不可急于求成。',
    element: '木',
    number: 53,
    hexagram: '䷴'
  },
  {
    id: 'guimei',
    name: '归妹',
    symbol: '☳☱',
    upperTrigram: '☳',
    lowerTrigram: '☱',
    upperName: '震',
    lowerName: '兑',
    description: '征凶，无攸利。',
    meaning: '雷泽归妹，象征嫁娶、归宿、婚姻。代表婚姻、归宿、结合。主婚姻之事，需谨慎。',
    advice: '宜慎重考虑，不可轻率。婚姻大事要慎重，不可操之过急。',
    element: '金',
    number: 54,
    hexagram: '䷵'
  },
  {
    id: 'feng',
    name: '丰',
    symbol: '☳☲',
    upperTrigram: '☳',
    lowerTrigram: '☲',
    upperName: '震',
    lowerName: '离',
    description: '亨，王假之，勿忧，宜日中。',
    meaning: '雷火丰，象征丰盛、盛大、繁荣。代表丰盛、繁荣、盛大。主事业丰盛，但需防衰。',
    advice: '宜居安思危，防微杜渐。在最丰盛时要想到衰败，提前预防。',
    element: '火',
    number: 55,
    hexagram: '䷶'
  },
  {
    id: 'lv_gua',
    name: '旅',
    symbol: '☲☶',
    upperTrigram: '☲',
    lowerTrigram: '☶',
    upperName: '离',
    lowerName: '艮',
    description: '小亨，旅贞吉。',
    meaning: '火山旅，象征旅行、旅居、行旅。代表旅行、漂泊、外出。主在外漂泊，需谨慎。',
    advice: '宜谨慎守正，不可妄动。在外要小心谨慎，遵守当地规矩。',
    element: '火',
    number: 56,
    hexagram: '䷷'
  },
  // 坤宫八卦
  {
    id: 'xun',
    name: '巽',
    symbol: '☴☴',
    upperTrigram: '☴',
    lowerTrigram: '☴',
    upperName: '巽',
    lowerName: '巽',
    description: '小亨，利有攸往，利见大人。',
    meaning: '巽为风，象征顺从、进入、谦逊。代表顺从、进入、谦逊。主谦逊顺从，可获吉祥。',
    advice: '宜谦逊顺从，顺势而行。要谦逊待人，顺应时势，可获成功。',
    element: '木',
    number: 57,
    hexagram: '䷸'
  },
  {
    id: 'dui',
    name: '兑',
    symbol: '☱☱',
    upperTrigram: '☱',
    lowerTrigram: '☱',
    upperName: '兑',
    lowerName: '兑',
    description: '亨，利贞。',
    meaning: '兑为泽，象征喜悦、愉快、和悦。代表喜悦、愉快、口舌。主心情愉快，但需防口舌。',
    advice: '宜和颜悦色，真诚待人。要以和悦待人，但也要防小人挑拨。',
    element: '金',
    number: 58,
    hexagram: '䷹'
  },
  {
    id: 'huan',
    name: '涣',
    symbol: '☴☵',
    upperTrigram: '☴',
    lowerTrigram: '☵',
    upperName: '巽',
    lowerName: '坎',
    description: '亨。王假有庙，利涉大川，利贞。',
    meaning: '风水涣，象征涣散、消散、分散。代表涣散、分散、化解。主化解困难，人心涣散。',
    advice: '宜凝聚人心，化解困难。要凝聚涣散的人心，化解各种困难。',
    element: '木',
    number: 59,
    hexagram: '䷺'
  },
  {
    id: 'jie_gua',
    name: '节',
    symbol: '☵☱',
    upperTrigram: '☵',
    lowerTrigram: '☱',
    upperName: '坎',
    lowerName: '兑',
    description: '亨。苦节不可贞。',
    meaning: '水泽节，象征节制、节约、节度。代表节制、节约、适度。主要懂得节制，不可过度。',
    advice: '宜适度节制，不可过度。要懂得节制，但过度节制会适得其反。',
    element: '水',
    number: 60,
    hexagram: '䷻'
  },
  {
    id: 'zhongfu',
    name: '中孚',
    symbol: '☱☴',
    upperTrigram: '☱',
    lowerTrigram: '☴',
    upperName: '兑',
    lowerName: '巽',
    description: '豚鱼吉，利涉大川，利贞。',
    meaning: '风泽中孚，象征诚信、诚实、忠信。代表诚信、诚实、信任。主诚信为本，万事可成。',
    advice: '宜诚信为本，真诚待人。诚信是最重要的，要真诚对待他人。',
    element: '金',
    number: 61,
    hexagram: '䷼'
  },
  {
    id: 'xiaoguo',
    name: '小过',
    symbol: '☶☳',
    upperTrigram: '☶',
    lowerTrigram: '☳',
    upperName: '艮',
    lowerName: '震',
    description: '亨，利贞，可小事，不可大事。',
    meaning: '雷山小过，象征小的过度、小的过失。代表小的过失、小的过度。主小事可成，大事不可。',
    advice: '宜做小事，不可妄动。小事可以有所过度，大事必须谨慎。',
    element: '木',
    number: 62,
    hexagram: '䷽'
  },
  {
    id: 'jiji',
    name: '既济',
    symbol: '☵☲',
    upperTrigram: '☵',
    lowerTrigram: '☲',
    upperName: '坎',
    lowerName: '离',
    description: '亨，小利贞，初吉终乱。',
    meaning: '水火既济，象征已经完成，已经成功。代表完成、成功、成就。主已经成功，但需防败。',
    advice: '宜居安思危，防微杜渐。成功后要警惕衰败，保持谨慎。',
    element: '水',
    number: 63,
    hexagram: '䷾'
  },
  {
    id: 'weiji',
    name: '未济',
    symbol: '☲☵',
    upperTrigram: '☲',
    lowerTrigram: '☵',
    upperName: '离',
    lowerName: '坎',
    description: '亨，小狐汔济，濡其尾，无攸利。',
    meaning: '火水未济，象征尚未完成，尚未成功。代表未完成、继续、希望。主事情未完，继续努力。',
    advice: '宜继续努力，不可松懈。事情尚未完成，要继续努力，谨慎行事。',
    element: '火',
    number: 64,
    hexagram: '䷿'
  }
];

/**
 * 获取所有星曜
 */
export const ALL_STARS: ZiweiStar[] = [...MAIN_STARS, ...SECONDARY_STARS, ...MINOR_STARS];

/**
 * 根据ID获取星曜
 */
export function getStarById(id: string): ZiweiStar | undefined {
  return ALL_STARS.find(star => star.id === id);
}

/**
 * 根据ID获取卦象
 */
export function getGuaById(id: string): ZhouyiGua | undefined {
  return SIXTY_FOUR_GUA.find(gua => gua.id === id);
}

/**
 * 根据名称获取卦象
 */
export function getGuaByName(name: string): ZhouyiGua | undefined {
  return SIXTY_FOUR_GUA.find(gua => gua.name === name);
}

export default {
  MAIN_STARS,
  SECONDARY_STARS,
  MINOR_STARS,
  ALL_STARS,
  SIXTY_FOUR_GUA,
  getStarById,
  getGuaById,
  getGuaByName
};
