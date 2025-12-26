import { UserInput, Gender, ChatMessage } from "../types";
import { DrawnCard, TarotReadingResult, TarotSpread } from "../types/tarot";
import { TAROT_SYSTEM_INSTRUCTION } from "../constants/tarot";

const GAN_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_LIST = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getStemPolarity(yearPillar: string): 'YANG' | 'YIN' {
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const stem = yearPillar.substring(0, 1);
  return yangStems.includes(stem) ? 'YANG' : 'YIN';
}

function calculateCurrentLiuNian(
  _birthYear: number,
  currentAge: number,
  startAge: number,
  firstDaYun: string,
  gender: Gender,
  yearPillar: string
): string {
  const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const gan = firstDaYun.substring(0, 1);
  const zhi = firstDaYun.substring(1);
  const ganIndex = ganList.indexOf(gan);
  const zhiIndex = zhiList.indexOf(zhi);
  
  if (ganIndex === -1 || zhiIndex === -1) {
    return `${ganList[(currentAge - 1) % 10]}${zhiList[(currentAge - 1) % 12]}`;
  }
  
  const yearStemPolarity = getStemPolarity(yearPillar);
  const isForward = gender === Gender.MALE 
    ? yearStemPolarity === 'YANG' 
    : yearStemPolarity === 'YIN';
  
  const daYunIndex = Math.max(0, Math.floor((currentAge - startAge) / 10));
  
  const currentGanIndex = isForward 
    ? (ganIndex + daYunIndex) % 10 
    : (ganIndex - daYunIndex + 10) % 10;
  const currentZhiIndex = isForward 
    ? (zhiIndex + daYunIndex) % 12 
    : (zhiIndex - daYunIndex + 12) % 12;
  
  const yearOffset = currentAge - startAge - daYunIndex * 10;
  const liunianGanIndex = (currentGanIndex + yearOffset) % 10;
  const liunianZhiIndex = (currentZhiIndex + yearOffset) % 12;
  
  return `${ganList[liunianGanIndex]}${zhiList[liunianZhiIndex]}`;
}

function generateChatSystemPrompt(
  currentDaYun: string,
  currentDaYunRange: string,
  currentLiuNian: string,
  currentAge: number
): string {
  return `
## 角色与核心原则
你是专业的盲派命理分析助手，旨在为用户提供**直指核心、象法丰满**的命运事件解读。
- **核心方法论**：严格遵循盲派 **"宾主定内外，体用断事象"** 的根本思想。
    - **宾主**：日柱、时柱为 **"主位"** （自己、家庭、内心）；年柱、月柱为 **"宾位"** （外界、他人、社会）。
    - **体用**：
        - **体**：代表 **"我"及"我的工具"**，包括：**日主、印星、比肩、劫财、禄神、羊刃、食神、伤官**。**特别关键**：凡是从日柱或时柱地支中 **"透出"到天干**的五行，可直接视为命主最直接、最得力的 **"体"**（工具或自身能力）。
        - **用**：代表 **"我追求的目标"**，即 **财星与官杀**。
- **分析灵魂**：所有论断必须基于 **"原局的'体'如何作用'用'"**（做功），以及 **"大运流年如何引动此一关系"**。严禁使用"身强身弱"、"五行平衡"等子平概念。

## 当前运势背景（重要！）
**当前大运**：${currentDaYun}（${currentDaYunRange}）
**当前流年**：${currentLiuNian}（${currentAge}岁）
**分析时请以当前大运和流年为基准时间点**，结合用户提问进行针对性解读。用户提问如未指明具体时间，默认以当前大运/流年为背景进行分析。

## 快速推演框架（思考路径）
面对任何问题，思考应瞬间锁定以下逻辑链：
1.  **辨体用**：问题所及之事，对应的是 **"体"还是"用"**？它在原局中状态如何？尤其是，有无从 **日时主位透出**的"体"参与核心做功？
2.  **看引动**：当前大运（${currentDaYun}）、流年（${currentLiuNian}）干支，通过 **刑、冲、合、害、墓、透**中的哪种方式，**引动了"体"还是"用"**？
3.  **断吉凶**：此引动是 **让"体"更有效地获取"用"**（吉），还是 **让"体"受损或"用"逃脱**（凶）？据此对应现实事件。

## 回答格式与丰满话术范例
采用 **"结论定性 + 体用逻辑 + 现实成像"** 的三段式结构，确保精准狠辣且内容充实。

**1. 问事业财运**
- **范例**："**这步运是开拓市场、通过专业技能求财的运。** 你的局核心是 **'时柱透出的食神（体）去生宾位的财星（用）'**。现在大运走比劫，生助食神，增强了你的'生产工具'。**这意味着**：这十年适合靠口才、技术、创新点子赚钱，但过程需要亲力亲为或与同事紧密合作，财富是'生产'出来的，而非投机所得。"
- **范例**："**今年（${currentLiuNian}年）有强烈的合作求财或职场竞争信号。** 流年'${currentLiuNian.substring(0, 1)}'透干，合动了你命中的财星。**这是'体'来合'用'的象。** 所以，今年易有新的合作机会、加入团队项目，但也必然面临同行或同事间的明争暗夺。"

**2. 问婚姻感情**
- **范例**："**你的婚姻，关键在于'妻星'这个'用'能否被主位顺利得到。** 你的财星（妻星）在月柱（宾位），且被年柱的比劫遥克，这叫'财星在宾位被劫'。**主象为**：感情早期易有竞争者，或所遇心仪对象本身选择较多。**化解之道**在于等待大运流年将财星'合入'或'引到'日时主位。"
- **范例**："**${currentLiuNian}年是感情变化的重要年份。** 流年干支与你的命局产生特定作用关系，**这是特定能量组合的引动**。尤其应象在特定月份，需根据具体流月进一步细化。"

**3. 问流年吉凶**
- **范例**："**${currentLiuNian}年对你而言是'${currentDaYun}大运背景下的关键应期'。** 流年干支通过 **刑、冲、合、害** 等方式引动了原局中的关键组合。**具体象法**：根据当前引动的宫位和十神，可以判断具体发生的事项领域。**关键在于**：此引动是推动原局做功成功，还是破坏做功或引发冲突。"

**4. 问人生选择**
- **范例**："**选择深耕技术路线，比管理路线更能发挥你的命局优势。** 你的命局中，**从日支或时柱中透出的五行**，这是你最得力的'体'（工具）。**这意味着**你的天赋和热情在于将事情钻研透彻、创新突破。强行走纯管理（官杀）路线，是用你的短板去竞争。应在技术领域做到顶尖，权责（官）自然随之而来。"

**最终准则**：你的每次分析，都应像一把手术刀，精准剖开 **"体用作用"** 的关系，并描绘出清晰的现实图像。现在，请开始为用户提供锋利而丰满的洞察。
`;
}

function calculateCurrentDaYun(
  birthYear: number,
  startAge: number,
  firstDaYun: string,
  gender: Gender,
  yearPillar: string
): { name: string; startAge: number; endAge: number; age: number } {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  
  if (currentAge < startAge) {
    return { name: '童限', startAge: 0, endAge: startAge - 1, age: currentAge };
  }
  
  const gan = firstDaYun.substring(0, 1);
  const zhi = firstDaYun.substring(1);
  const ganIndex = GAN_LIST.indexOf(gan);
  const zhiIndex = ZHI_LIST.indexOf(zhi);
  
  if (ganIndex === -1 || zhiIndex === -1) {
    throw new Error('大运格式不正确');
  }
  
  const yearStemPolarity = getStemPolarity(yearPillar);
  const isForward = gender === Gender.MALE 
    ? yearStemPolarity === 'YANG' 
    : yearStemPolarity === 'YIN';
  
  const daYunIndex = Math.floor((currentAge - startAge) / 10);
  
  const currentGanIndex = isForward 
    ? (ganIndex + daYunIndex) % 10 
    : (ganIndex - daYunIndex + 10) % 10;
  const currentZhiIndex = isForward 
    ? (zhiIndex + daYunIndex) % 12 
    : (zhiIndex - daYunIndex + 12) % 12;
  
  const currentDaYunName = `${GAN_LIST[currentGanIndex]}${ZHI_LIST[currentZhiIndex]}`;
  const daYunStartAge = startAge + daYunIndex * 10;
  const daYunEndAge = daYunStartAge + 9;
  
  return {
    name: currentDaYunName,
    startAge: daYunStartAge,
    endAge: daYunEndAge,
    age: currentAge
  };
}

export const generateLifeAnalysis = async (input: UserInput): Promise<string> => {
  const { apiKey, apiBaseUrl, modelName } = input;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  const genderStr = input.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const birthYear = parseInt(input.birthYear) || 1990;
  const startAge = parseInt(input.startAge) || 1;
  
  const currentDaYun = calculateCurrentDaYun(
    birthYear,
    startAge,
    input.firstDaYun,
    input.gender,
    input.yearPillar
  );
  
  const currentDaYunInfo = currentDaYun.name === '童限' 
    ? `命主尚未起运（${currentDaYun.age}岁）`
    : `${currentDaYun.name}大运（${currentDaYun.startAge}-${currentDaYun.endAge}岁，当前${currentDaYun.age}岁）`;

  const userPrompt = `你是一位精通盲派命理的专家，请对以下命盘进行深度分析。**核心方法论：以盲派"宾主体用、做功效率"为根本路径，以传统"十神格局"为层次升降的重要参考。全程禁止使用"身强身弱"、"五行平衡"、"旺衰"等概念。**
 
 **一、命主信息**
 八字：${genderStr} ${input.yearPillar} ${input.monthPillar} ${input.dayPillar} ${input.hourPillar}
 性别：${genderStr}
 出生年份：${birthYear}年
 起运年龄：${startAge}岁
 第一步大运：${input.firstDaYun}
 **当前大运**：${currentDaYunInfo}
 
 **二、核心分析指令**

 **第一部分：原局分析（定路线、察格局）**
 1.  **分宾主，定体用**：
     *   **主位（我）**：**日柱与时柱**。从日、时透出之天干，为我可用之"体"或"工具"。
     *   **宾位（外）**：年柱与月柱。
     *   **体用界定**：全局中，**"体"**（我及工具：日主、印、禄、劫、食伤）与**"用"**（目标：财、官）是什么？核心是看"体"是否有效制化"用"。
 
 2.  **查作用，明做功**：
     *   排查所有 **刑、冲、克、穿、合、墓** 关系。
     *   **做功模式**：确定核心做功方式（如：**禄神制财、食神制杀、印制食伤、财星合身**）。
 
 3.  **辨格局，定加减**（本步为层次升降之关键）：
     *   在明确做功方式的基础上，识别是否构成以下传统格局（此为**加分项**）：
         *   **成格**：伤官合杀、食神制杀、伤官配印、官印相生、财官双美、杀印相生、食神生财（且财有源）等。此类格局本身代表一种**高效、清纯的做功模式**，会显著提升命局层次。
         *   **败格或降格**：伤官见官、官杀混杂、枭神夺食、比劫争财、财星坏印等。此类组合代表做功中的**内耗、冲突和低效**，会降低命局层次，即便做功也多辛苦波折。
     *   **关键**：格局必须结合具体的**做功位置**（宾主）与**十神质量**（是否被刑冲破坏）来综合评定。
 
 **第二部分：大运分析（观引动、判扶抑）**
 1.  **作用引动**：
     *   分析大运干支与原局产生的**刑、冲、合、害、墓**关系。
     *   判断大运是**引动并增强了原局的"体"或"用"**，还是**引动了忌神干扰、破坏了原局核心做功或格局**。
 
 2.  **格局成败**：
     *   大运是**令原局格局成真、澄清**，还是**导致格局破败、混杂**？这是判断大运吉凶质地的核心。
 
 **第三部分：综合论断（断层次、论事象）**
 1.  **命局层次与走势总评**：
     *   **先天层次** = **原局做功效率**（盲派核心） + **格局优劣加减**（传统参考）。由此定出根基高低。
     *   **阶段走势** = **先天层次** + **大运扶抑**。明确当前大运是"锦上添花"、"雪中送炭"，还是"怀才不遇"、"火上浇油"。
 
 2.  **人生领域解读**（推理必须源于上述分析）：
     *   **事业财运**：由核心做功的"体"和"用"决定行业性质；由格局高低判断成就上限。
     *   **婚姻六亲**：重点考察夫妻星、宫与他柱的刑冲合关系。
     *   **其他提示**：根据干支刑冲克穿，提示健康隐患；从比劫状态看人际关系。
 
 **三、输出要求**
 按以下结构输出，确保推理完整：
 
 1.  **【原局解码】**
     *   宾主体用：\`[主位之体，宾位之用]\`
     *   核心做功：\`[关键作用关系]\`
     *   格局鉴定：\`[构成何格，成/败与否，对层次的影响]\`
     *   先天层次总评：\`[结合做功与格局的结论]\`
 
 2.  **【大运影响】**
     *   作用引动：\`[大运具体激活了原局何字]\`
     *   格局变化：\`[大运使格局更清或更浊]\`
     *   运势判断：\`[对原局是辅助/违背]\`
 
 3.  **【综合论断】**
     *   当前阶段总评：\`[先天层次 + 大运影响后的现状]\`
     *   事业财运方向：\`[推导出的具体方向]\`
     *   婚姻感情要点：\`[主要特征与问题]\`
     *   其他领域提示：`;

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = `API 请求失败: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期，请检查您的 API Key 配置';
      } else if (response.status === 429) {
        errorMessage = 'API 请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = 'API 服务器内部错误，请稍后再试';
      } else if (errText) {
        errorMessage = `API 请求失败: ${response.status} - ${errText}`;
      }
      
      throw new Error(errorMessage);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    return content;
  } catch (error) {
    console.error("Gemini/OpenAI API Error:", error);
    throw error;
  }
};

export const generateChatResponse = async (
  userInput: UserInput,
  chatHistory: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const { apiKey, apiBaseUrl, modelName } = userInput;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  const genderStr = userInput.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const bazi = `${userInput.yearPillar} ${userInput.monthPillar} ${userInput.dayPillar} ${userInput.hourPillar}`;
  
  const birthYear = parseInt(userInput.birthYear) || 1990;
  const startAge = parseInt(userInput.startAge) || 1;
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;
  
  const currentDaYun = calculateCurrentDaYun(
    birthYear,
    startAge,
    userInput.firstDaYun,
    userInput.gender,
    userInput.yearPillar
  );
  
  const currentLiuNian = calculateCurrentLiuNian(
    birthYear,
    currentAge,
    startAge,
    userInput.firstDaYun,
    userInput.gender,
    userInput.yearPillar
  );
  
  const currentDaYunRange = currentDaYun.name === '童限'
    ? `${currentDaYun.age}岁（童限期）`
    : `${currentDaYun.startAge}-${currentDaYun.endAge}岁`;
  
  const systemPrompt = generateChatSystemPrompt(
    currentDaYun.name,
    currentDaYunRange,
    currentLiuNian,
    currentAge
  );

  const systemContext = `
你是专业的盲派命理分析助手，请严格遵循以下原则：

【用户基本信息】
八字：${bazi}
性别：${genderStr}
出生年份：${birthYear}年
起运年龄：${startAge}岁
当前年龄：${currentAge}岁
当前大运：${currentDaYun.name}（${currentDaYunRange}）
当前流年：${currentLiuNian}

${systemPrompt}
`;

  const messages = [
    { role: "system", content: systemContext },
    ...chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = `API 请求失败: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期，请检查您的 API Key 配置';
      } else if (response.status === 429) {
        errorMessage = 'API 请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = 'API 服务器内部错误，请稍后再试';
      } else if (errText) {
        errorMessage = `API 请求失败: ${response.status} - ${errText}`;
      }
      
      throw new Error(errorMessage);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    return content;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};

export const generateDayunAnalysis = async (
  userInput: UserInput,
  dayun: string,
  startAge: number,
  endAge: number
): Promise<string> => {
  const { apiKey, apiBaseUrl, modelName } = userInput;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  const genderStr = userInput.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const bazi = `${userInput.yearPillar} ${userInput.monthPillar} ${userInput.dayPillar} ${userInput.hourPillar}`;
  
  const birthYear = parseInt(userInput.birthYear) || 1990;
  const startCalendarYear = birthYear + startAge;
  const endCalendarYear = birthYear + endAge;

  const userPrompt = `
你是一位精通盲派命理的专家，请严格遵循盲派"宾主"理论与"做功"思想，对以下命局进行大运分析。核心原则：大运的吉凶完全取决于其干支与原局发生的"刑、冲、合、害、墓、透出"等关系，以及这些关系对原局"体用做功"模式的影响。禁止使用"喜神"、"忌神"、"旺衰"等概念。

【一、命局信息】
八字：${bazi}
性别：${genderStr}
当前/关注的大运：${dayun}大运
年龄范围：${startAge}岁 - ${endAge}岁（即公历${startCalendarYear}年 - ${endCalendarYear}年）

【二、重要限制（必读）】
**"关键流年点睛"部分必须严格限定在当前大运范围内，即只能分析 ${startAge}岁到 ${endAge}岁之间的流年（对应公历${startCalendarYear}年至${endCalendarYear}年）。**
**绝对不能分析此范围之外的流年（包括之前的积累运或之后的延续运），即便某些流年具有特殊信号，也必须明确说明"此流年超出当前大运范围，不在本次分析范围内"。**

【三、核心分析逻辑（你的思考内核）】
第一步：定根基（看原局）

分宾主：日柱、时柱为 “主位” （命主自身、家庭、行为结果）；年柱、月柱为 “宾位” （外界、他人、社会环境）。

辨体用：

体（我与工具）：日主、印星、比肩、劫财、禄神、食神、伤官。

用（追求目标）：财星、官杀。

明做功：看原局“体”通过何种方式（合、冲、制、化、墓）作用“用”。此为人生核心剧本。

第二步：断引动（看大运）

找关系：大运干支与原局产生了哪些 “刑、冲、合、害、透出” 关系？重点看它剧烈地改变了哪个“字”。

定角色：被引动的“字”是 “体”还是“用”？它位于哪个 “宫位” （年/月/日/时）？代表什么 “十神”？

判影响：此引动是 强化了原局做功（体易制用），还是 破坏了原局做功（用来攻体，或体用皆伤）？

【四、输出要求（请直接按此格式输出）】
请基于以上逻辑，直接给出精准、具体的断语，无需陈述分析过程。

1. 大运总象
用一句总结性断语概括这十年运势的核心基调。

示例：“此运是‘十年磨剑，终获名位，但家宅多耗’的时期。”

2. 具体事件预测
结合 “宫位”（事发生领域）与 “十神”（具体事象），直接列出2-4项最可能发生的具体事件。

格式：[主要领域/宫位对应]：[具体事件描述，需包含明确的十神与宫位指代]

推断逻辑参考：

引动年柱（祖上、远方）：易有环境迁徙、与大家族或远方事务关联。

引动月柱（父母、工作、社交）：事业平台变动、同事关系变化、父母健康波动。

引动日支夫妻宫：婚姻状态、配偶自身运势、同居分手等明显变动。

引动时柱（子女、下属、晚年）：投资、生育、下属关系、技术深造。

引动/透出财星：直接与钱财、物质、男命感情相关。

引动/透出官杀：与事业、压力、职务、女命姻缘、官非相关。

引动/透出印星：与学习、证书、房产、长辈、贵人相关。

引动/透出食伤：与发挥、投资、子女、技术、口舌相关。

引动/透出比劫：与朋友、合作、竞争、破财、身体相关。

示例：

事业财运（月柱财星被引动）：将通过团队合作或竞争关系求财，有新的收入渠道，但分利、垫资情况明显。

婚姻家宅（日支被冲合）：夫妻关系面临外部环境压力或聚少离多，易因房产、长辈事宜产生分歧。

健康人际（比劫过旺或体被克）：需特别注意因过度劳累引发的肝胆或脾胃系统问题，人际上竞争加剧。

3. 关键流年点睛
指出1-2个会 “引爆”或“兑现” 核心事件的特定流年，并简述应事。
`;

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API 请求失败: ${response.status} - ${errText}`);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    return content;
  } catch (error) {
    console.error("Gemini/OpenAI API Error:", error);
    throw error;
  }
};

export const generateTarotReading = async (
  userInput: UserInput,
  question: string,
  spread: TarotSpread,
  drawnCards: DrawnCard[]
): Promise<TarotReadingResult> => {
  const { apiKey, apiBaseUrl, modelName } = userInput;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  const cardsInfo = drawnCards.map(dc => {
    const meaning = dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright;
    const position = dc.position.name;
    const positionDesc = dc.position.description;
    const status = dc.isReversed ? "（逆位）" : "（正位）";
    
    return `**${position}** - ${dc.card.name}${status}\n` +
           `- 牌位含义：${positionDesc}\n` +
           `- 牌面含义：${meaning}\n` +
           `- 关键词：${dc.card.keywords.join('、')}\n`;
  }).join('\n');

  const userPrompt = `
请对以下塔罗牌阵进行深度解读：

## 用户问题
${question}

## 牌阵信息
**牌阵名称**：${spread.name}（${spread.nameEn}）
**牌阵描述**：${spread.description}

## 抽出的牌
${cardsInfo}

## 解读要求
请按照以下结构进行解读，使用Markdown格式：

### 1. 牌阵说明
简要说明所选牌阵的特点和适用性

### 2. 逐牌解读
对每一张牌进行详细解读，包括：
- 牌位含义
- 牌面含义（正位/逆位）
- 与问题的关联

### 3. 整体解读
综合所有牌面，分析整体能量流向和核心信息

### 4. 具体建议
基于牌面信息，提供3-5条具体可行的建议

### 5. 关键词总结
用3-5个关键词总结本次解读的核心主题

请确保解读客观中立，不做出绝对化的预测，以启发和引导为主。
`;

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "system", content: TAROT_SYSTEM_INSTRUCTION },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 6000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = `API 请求失败: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期，请检查您的 API Key 配置';
      } else if (response.status === 429) {
        errorMessage = 'API 请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = 'API 服务器内部错误，请稍后再试';
      } else if (errText) {
        errorMessage = `API 请求失败: ${response.status} - ${errText}`;
      }
      
      throw new Error(errorMessage);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    const allKeywords = drawnCards.flatMap(dc => dc.card.keywords);
    const uniqueKeywords = Array.from(new Set(allKeywords)).slice(0, 10);

    return {
      spread,
      question,
      cards: drawnCards,
      overallInterpretation: content,
      advice: [],
      keywords: uniqueKeywords
    };
  } catch (error) {
    console.error("Tarot Reading API Error:", error);
    throw error;
  }
};

export const generateTarotChatResponse = async (
  userInput: UserInput,
  chatHistory: { role: string; content: string }[],
  userMessage: string,
  currentReading?: TarotReadingResult
): Promise<string> => {
  const { apiKey, apiBaseUrl, modelName } = userInput;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  let contextPrompt = TAROT_SYSTEM_INSTRUCTION;

  if (currentReading) {
    const cardsInfo = currentReading.cards.map(dc => {
      const meaning = dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright;
      const position = dc.position.name;
      const status = dc.isReversed ? "（逆位）" : "（正位）";
      
      return `**${position}** - ${dc.card.name}${status}：${meaning}`;
    }).join('\n');

    contextPrompt += `\n\n## 当前牌阵背景\n` +
      `**牌阵**：${currentReading.spread.name}\n` +
      `**问题**：${currentReading.question}\n` +
      `**抽出的牌**：\n${cardsInfo}\n\n` +
      `请基于以上牌阵信息回答用户的问题。`;
  }

  const messages = [
    { role: "system", content: contextPrompt },
    ...chatHistory,
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        temperature: 0.8,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = `API 请求失败: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期，请检查您的 API Key 配置';
      } else if (response.status === 429) {
        errorMessage = 'API 请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = 'API 服务器内部错误，请稍后再试';
      } else if (errText) {
        errorMessage = `API 请求失败: ${response.status} - ${errText}`;
      }
      
      throw new Error(errorMessage);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    return content;
  } catch (error) {
    console.error("Tarot Chat API Error:", error);
    throw error;
  }
};

export const testApiConnection = async (
  apiKey: string,
  apiBaseUrl: string,
  modelName: string
): Promise<{ success: boolean; message: string }> => {
  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    return { success: false, message: "API Key 不能为空" };
  }

  if (!cleanBaseUrl) {
    return { success: false, message: "API Base URL 不能为空" };
  }

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "user", content: "测试连接" }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = `API 请求失败: ${response.status}`;
      
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期';
      } else if (response.status === 429) {
        errorMessage = 'API 请求过于频繁，请稍后再试';
      } else if (response.status === 500) {
        errorMessage = 'API 服务器内部错误';
      } else if (errText) {
        errorMessage = `API 请求失败: ${response.status} - ${errText}`;
      }
      
      return { success: false, message: errorMessage };
    }

    const jsonResult = await response.json();
    if (jsonResult.choices && jsonResult.choices.length > 0) {
      return { success: true, message: "API 连接成功！" };
    } else {
      return { success: false, message: "API 返回数据格式异常" };
    }
  } catch (error: any) {
    return { success: false, message: `连接失败: ${error.message}` };
  }
};

export const generateLiunianAnalysis = async (
  userInput: UserInput,
  dayun: string,
  liunian: string,
  age: number
): Promise<string> => {
  const { apiKey, apiBaseUrl, modelName } = userInput;

  const cleanApiKey = apiKey ? apiKey.trim() : "";
  const cleanBaseUrl = apiBaseUrl ? apiBaseUrl.trim().replace(/\/+$/, "") : "";
  const targetModel = modelName && modelName.trim() ? modelName.trim() : "gemini-3-pro-preview";

  if (!cleanApiKey) {
    throw new Error("请在表单中填写有效的 API Key");
  }

  if (!cleanBaseUrl) {
    throw new Error("请在表单中填写有效的 API Base URL");
  }

  const genderStr = userInput.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)';
  const bazi = `${userInput.yearPillar} ${userInput.monthPillar} ${userInput.dayPillar} ${userInput.hourPillar}`;

  const userPrompt = `
你是一位顶尖的盲派命理专家，请对指定流年进行精析。核心铁律：以原局“体用做功主宾得失”为根本，以大运为十年环境背景，以流年为当年主导力量。论断吉凶，唯看流年作用对“体用得与失”的影响，并全面覆盖人生各领域。
全程禁止使用"身强身弱"、"五行平衡"、"旺衰"等概念。
【一、命局与运势信息】
八字：${bazi}
性别：${genderStr}
当前大运：${dayun}
分析流年：${liunian}
年龄：${age}岁

【二、你的思考内核（必须执行）】

原局根本：原局以何“体”取何“用”？其设计的做功方式（合、冲、制、墓）是什么？此为一切分析起点。

大运背景：当前${dayun}大运，对原局的“体”、“用”力量与做功效率，构成了何种长期环境？（是巩固、削弱、转化还是引入变数？）

流年主导：流年${liunian}干支（含藏干）作为当年最强力量，如何直接介入并改变上述格局？

作用关系：必须找出流年与原局产生的所有 刑、冲、克、合、害 关系，明确触动哪个“字”、其“十神”与“宫位”。

藏干意图：流年地支藏干中，是否有原局核心的“体”或“用”？这是流年赋予的深层工具或目标，至关重要。

综断得失：在大运背景下，流年的主导作用是推动“体”成功获取了“用”（得，吉），还是导致“体”伤或“用”散（失，凶）？此结论是判断各领域吉凶的总纲。

【三、输出要求（严格按此格式与逻辑输出）】
1. 流年总判
用一句话，综合大运背景与流年主导，论断此年根本性质和突出特征。

示例：“在 ${dayun} 运[描述背景，如：生扶日主]的背景下，流年 ${liunian} 以[其核心干支/藏干]强力[生助/冲克]原局[关键体/用]，引动并成就/破坏了‘[原局做功方式]’之局，全年基调为[二字概括，如：进取得利/守成为上]。”

2. 各领域吉凶直断（核心输出）
请主动针对以下所有领域进行论断。每个领域均需遵循 “领域焦点 → 大运环境 → 流年主导作用 → 具体事象” 的完整逻辑链。

① 婚姻感情：

焦点：日支夫妻宫及配偶星（男财女官）。

论断：大运背景下，夫妻宫/星状态[简述]。流年${liunian} [具体作用，如：合入、冲克]此焦点，主……[吉凶性质]……。现实多应于[具体事件，如：关系升温或僵持、同居或分居、遇到正缘或烂桃花]。

② 精神与身体健康：

焦点：日主自身及禄、刃、食伤等“体”。

论断：大运背景下，自身根基[简述]。流年${liunian} [具体作用]于此焦点，主……[吉凶性质]……。需特别注意[具体部位或情绪，如：心脑血管、肝胆、脾胃；或思虑过重、精力透支]。

③ 事业财运：

焦点：原局“用”神（财、官）及“体”制“用”的组合。

论断：大运背景下，求财求官环境[简述]。流年${liunian} [具体作用]于此焦点，主……[吉凶性质]……。多应在[具体场景，如：项目成败、岗位变动、投资盈亏、薪资调整]。

④ 人际关系与六亲：

焦点：年柱（祖上、父母）、月柱（父母、兄弟同僚）、比劫星。

论断：大运背景下，人际环境[简述]。流年${liunian} [具体作用]于此焦点，主……[吉凶性质]……。易体现为[具体互动，如：得长辈关照、与同辈竞争合作、为家庭事务奔波、关注某位亲属健康]。

⑤ 其他重要提示（如学业、出行、法律等）：

焦点：印星（学业、房产）、官杀（压力、官非）、马星（变动）。

论断：流年${liunian} [具体作用]于此焦点，主……[相关事象]……。

3. 关键应期
指出流年力量最强、最易应事的1-2个月份。

示例：农历[某]月[天干地支]，流年[某五行]气或[某作用关系]达到顶峰，“[某领域]”相关之事将迎来关键节点。

（请开始你的分析，直接按上述格式输出）
`;

  try {
    const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API 请求失败: ${response.status} - ${errText}`);
    }

    const jsonResult = await response.json();
    const content = jsonResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("模型未返回任何内容。");
    }

    return content;
  } catch (error) {
    console.error("Gemini/OpenAI API Error:", error);
    throw error;
  }
};
