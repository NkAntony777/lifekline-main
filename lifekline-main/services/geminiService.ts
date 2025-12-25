
import { CHAT_SYSTEM_INSTRUCTION } from "../constants";
import { UserInput, Gender, ChatMessage } from "../types";

const GAN_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI_LIST = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function getStemPolarity(yearPillar: string): 'YANG' | 'YIN' {
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const stem = yearPillar.substring(0, 1);
  return yangStems.includes(stem) ? 'YANG' : 'YIN';
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

  const systemContext = `
你是专业的盲派命理分析助手，请严格遵循以下原则：

【用户基本信息】
八字：${bazi}
性别：${genderStr}
第一步大运：${userInput.firstDaYun}
起运年龄：${userInput.startAge}岁

${CHAT_SYSTEM_INSTRUCTION}
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

  const userPrompt = `
你是一位精通盲派命理的专家，请严格遵循盲派"宾主"理论与"做功"思想，对以下命局进行大运分析。**核心原则：大运的吉凶完全取决于其干支与原局发生的"刑、冲、合、害、墓、透出"等关系，以及这些关系对原局"体用做功"模式的影响。禁止使用"喜神"、"忌神"、"旺衰"等概念。**

【一、命局信息】
八字：${bazi}
性别：${genderStr}
当前/关注的大运：${dayun}大运
年龄范围：${startAge}岁 - ${endAge}岁

【二、核心分析指令】
请按以下步骤进行专业分析：

**第一步：确立原局宾主与做功模式（定根基）**
1.  **定宾主**：明确**日柱与时柱为主位**，代表命主自身、家庭及行为结果；年柱、月柱为宾位，代表外部环境与他人。
2.  **明体用**：分清八字中的 **"体"**（我及我的工具：日主、印星、比肩、劫财、禄神、食神、伤官）与 **"用"**（我要获取的目标：财星、官杀）。
3.  **察原局做功**：概述原局核心做功方式（如：禄神合财、伤官制官、印星化杀等），并指出财、官等"用"神落在宾位还是主位。这是大运引发吉凶的根基。

**第二步：分析大运干支与原局的作用关系（核心步骤）**
本步骤是重中之重，需逐条分析。

1.  **关系总览**：
    *   分析大运天干与原局各天干（特别是主位天干）的**生、克、合、冲**关系。
    *   分析大运地支与原局各地支（特别是日支、时支）的**刑、冲、合、害、破、墓**关系。
    *   **关键判断**：大运是**引动了"体"去制"用"**，还是**引动了"用"来攻"体"**？是**修复、强化**了原局的做功，还是**干扰、破坏**了原局的做功路径？

2.  **【精髓】"透出"分析**：
    *   如果大运**天干**可以视为从原局某个**地支**的藏干中"透出"（例如：原局地支有寅，大运天干为甲），必须立即回溯分析：
        a) **此干在原局中的角色**：它是 **"体"还是"用"？** 在原局整体做功中扮演什么角色？
        b) **此干在原局中的状态**：它在地支中是否有"根"？在原局天干是否已有显现？是否被原局其他干支**刑、冲、克、合**？
        c) **透出后的意义**：该力量从"潜伏"状态变为"公开"发挥作用，会使原局中与此干相关的十神信息与能量显著外显，主导此运主题。

3.  **大运作用虚实**：
    *   观察大运干支在原局是否有"根气"（即原局地支是否有其同五行或藏干）。有根则作用力实在，应事明显；无根则作用力虚浮，应事程度较轻或多为意向。

**第三步：综合推断大运吉凶与应事**
1.  **吉凶性质**：基于以上关系，判断此运是利于 **"得财得官"** （体成功制用、用顺利归主），还是易有 **"破财伤身"** （体被用伤、做功被破坏）等倾向。
2.  **应事领域**：根据被大运最强引动或透出的 **"十神"** 和 **"宫位"** ，推断事情发生的具体领域（如：财星引动主钱财经营，官杀引动主事业职务，夫妻宫引动主婚姻感情，印星引动主学业房产等）。
3.  **流年应期提示**：指出在此步大运中，哪些**流年**（通过与大运、原局形成三合、六合、刑冲等）会**加剧、引发或兑现**此运的核心事件。

【三、输出要求】
请按以下格式组织分析，确保逻辑严密：

1.  **【原局解码】**
    *   核心做功：\`[简述原局做功方式]\`
    *   体用分布：\`[体与用的关键位置]\`

2.  **【大运详析】**
    *   \`作用关系\`：\`[逐一列出大运干支与原局的关键作用，如：大运甲木合克原局己土、大运子水冲原局午火等]\`
    *   \`透出分析\`：\`[重点阐述任何"透出"关系及其对原局力量的改变]\`
    *   \`虚实判断\`：\`[说明大运作用力的实在程度]\`

3.  **【综合论断】**
    *   \`大运总象\`：\`[综合给出此步大运的整体吉凶性质论断]\`
    *   \`核心应事领域\`：\`[推断1-3个最主要的应事领域]\`
    *   \`重要流年提示\`：\`[指出需特别注意的潜在引动流年]\`
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
你是一位精通盲派命理的专家，请严格遵循盲派理论，对指定流年进行分析。**核心铁律：流年是应期，是触发器。它通过刑、冲、合、害、墓等关系，引动并兑现原局与大运中既定的能量组合与潜在矛盾。全程禁止使用"喜用神"、"忌神"、"五行旺衰"等概念。**

**一、命局与运势信息**
八字：${bazi}
性别：${genderStr}
当前大运：${dayun}
分析流年：${liunian}
年龄：${age}岁

**二、核心分析指令**
请按以下步骤进行专业分析：

**第一步：理法奠基——原局做功与大运态势**
1.  **原局核心**：简要点明原局的**核心做功方式**（如：禄神制财、食神制杀、印来化杀等）及关键的"体"（我的工具）与"用"（我的目标）分布。
2.  **大运态势**：简述当前大运干支对原局的作用。是**引动并增强了原局的"体"或"用"**，还是**引动了干扰力量或破坏了做功路径**？此为流年作用的舞台。

**第二步：关系引动——三层剖析流年作用（核心）**
本步骤是重中之重，需逐层剖析。

1.  **流年对原局的直接引动**：
    *   分析流年天干与原局各天干的**生、克、合、冲**关系。
    *   分析流年地支与原局各地支的**刑、冲、合、害、破、墓**关系。
    *   **关键**：找到被引动的具体"字"（干支），并明确其在原局中代表的 **"十神"**（财官印食等）与 **"宫位"**（年祖、月父母、日夫妻、时子女）。**引动即代表该字所象征的人、事、物进入动态期。**

2.  **流年与大运的互动引动**：
    *   分析流年干支与大运干支的**生克合冲**等关系。此关系决定该年运势的"主题框架"。
    *   特别关注 **"原局、大运、流年"三者**是否构成新的**三合、三会、三刑、六冲**等全局性组合。此类组合力量强大，常标志重大事件。

3.  **【精髓】"透出"与"到位"分析**：
    *   **透出**：若流年天干，可视为从**原局或大运地支**的藏干中"透出"（例如：原局地支有寅，流年天干见甲），则此力量从潜伏状态正式显现，主导该年核心事务。
    *   **到位**：若流年地支，恰好是原局或大运中某个天干的"禄"、"羊刃"或"根气"之地（如：原局天干有甲，流年地支见寅），则该天干力量变得真实不虚，其代表的事象会被落实或激化。

**第三步：综合推断——吉凶应事**
1.  **吉凶性质判断**：
    *   **吉**：流年作用**引动并强化了原局成功的做功模式**（如：使"体"更易制住"用"，或使"用"顺利归入主位）。
    *   **凶**：流年作用**引动并破坏、干扰了原局的做功**，或**引动"体"与"用"发生激烈冲突**（如官星来伤禄）。
2.  **应事领域推断**：根据被最强引动的"十神"和"宫位"，推断具体领域（如：财星被合动主钱财、感情；官杀被冲克主事业变动、官非；印星被生扶主学业、房产；食伤被引动主投资、生育等）。
3.  **应期时效提示**：可指出事件易在**与流年地支五行同气或发生强烈引动**的季节/月份凸显（如：流年为申金，应事多在秋季或申月、巳月等）。

**三、输出要求**
请按以下格式组织分析，确保推断有据：

1.  **【背景提要】**
    *   原局核心做功：\`[简述]\`
    *   当前大运态势：\`[简述]\`

2.  **【流年深度剖析】**
    *   \`引动原局\`：\`[列出流年干支与原局的关键作用，如：流年乙木合原局庚金、流年巳火冲原局亥水等，并说明引动了何十神与宫位]\`
    *   \`作用大运\`：\`[分析流年与大运的互动关系]\`
    *   \`透出/到位\`：\`[重点解释任何"透出"或"到位"现象及其意义]\`

3.  **【综合论断】**
    *   \`流年总象\`：\`[综合以上，给出此年吉凶性质的结论]\`
    *   \`核心应事\`：\`[推断1-3个最可能发生的核心事件领域]\`
    *   \`关键节点提示\`：\`[指出需要特别注意的五行时节或月份]\`
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
