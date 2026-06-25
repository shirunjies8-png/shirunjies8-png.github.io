(() => {
  const STORAGE = {
    admin: "liqiAiAdminData",
    inquiries: "liqiAiInquiries",
    draft: "liqiAiAiDraft",
    activeAction: "liqiAiActiveAction",
  };

  const DEFAULT_ADMIN = {
    enterprise: "溧企AI示例企业",
    industry: "other",
    business: "企业服务",
    products: "企业展示、产品介绍、客户入口、招聘文案",
    equipment: "本地模板生成、DeepSeek 接口预留、手机电脑都能打开",
    advantage: "不用懂电脑、不会写文案、有微信电话就能做",
    phone: "13961109605",
    wechat: "liqi-ai-demo",
    email: "1105349573@qq.com",
    customer: "张先生",
    demand: "合作咨询、报价需求、服务预约",
    budget: "预算待确认",
    risk: "价格、交付、服务边界",
  };

  const INDUSTRY_MAP = {
    machining: {
      name: "机械加工",
      template: "设备能力、加工精度、来图报价、打样和批量生产",
      products: "CNC加工中心、数控车床、精密零部件",
      business: "机械零件加工、精密制造、来图报价",
      advantage: "交期靠谱、质量稳定、能接小批量打样",
    },
    sheetmetal: {
      name: "钣金焊接",
      template: "激光切割、折弯、焊接、结构件展示",
      products: "钣金件、焊接结构件、设备支架",
      business: "钣金加工、焊接加工、结构件制造",
      advantage: "报价快、响应快、适合配套合作",
    },
    automation: {
      name: "自动化设备",
      template: "设备方案、非标定制、案例展示、客户沟通",
      products: "自动化设备、工装夹具、产线配套",
      business: "自动化设备设计、制造和配套",
      advantage: "可定制、能落地、适合项目合作",
    },
    energy: {
      name: "新能源",
      template: "新能源配套、零部件、资质和案例",
      products: "新能源零部件、配套组件、结构件",
      business: "新能源行业配套制造和加工",
      advantage: "面向项目客户，重视稳定和交付",
    },
    food: {
      name: "食品加工",
      template: "生产环境、产品展示、资质证书、销售渠道",
      products: "食品加工、包装产品、配送服务",
      business: "食品生产、包装和销售",
      advantage: "卫生规范、信息透明、客户更放心",
    },
    packaging: {
      name: "包装印刷",
      template: "样品展示、工艺说明、交付能力、客户案例",
      products: "包装盒、标签、印刷品、礼盒",
      business: "包装设计、印刷加工、批量交付",
      advantage: "样品清楚、下单方便、交付稳定",
    },
    ecommerce: {
      name: "电商企业",
      template: "产品卖点、用户评价、购买方式、售后说明",
      products: "线上商品、组合套餐、爆款单品",
      business: "电商销售、商品运营、客户转化",
      advantage: "页面清楚、转化明确、适合转发",
    },
    service: {
      name: "服务行业",
      template: "服务项目、案例、价格说明、联系方式",
      products: "咨询服务、安装服务、维护服务",
      business: "企业服务、咨询、交付和售后",
      advantage: "说清服务、展示案例、方便联系",
    },
    other: {
      name: "其他",
      template: "企业展示、产品/服务、联系方式、客户入口",
      products: "主营业务、产品/服务、客户案例",
      business: "企业展示和客户沟通",
      advantage: "信息清楚、联系方便、适合转发",
    },
  };

  const ACTION_META = {
    intro: { title: "AI企业简介", prompt: "请生成企业简介", output: "intro" },
    product: { title: "AI产品介绍", prompt: "请生成产品介绍", output: "product" },
    promote: { title: "AI推广文案", prompt: "请生成推广文案", output: "promote" },
    analysis: { title: "AI客户分析", prompt: "请生成客户分析", output: "analysis" },
    advice: { title: "AI接单建议", prompt: "请判断是否建议接单并说明原因", output: "advice" },
    find: { title: "AI获客建议", prompt: "请生成获客建议", output: "find" },
    follow: { title: "AI跟进提醒", prompt: "请生成跟进提醒", output: "follow" },
    plan: { title: "AI自动运营", prompt: "请生成自动运营计划", output: "plan" },
    recruit: { title: "AI招聘文案", prompt: "请生成招聘文案", output: "recruit" },
    card: { title: "AI名片", prompt: "请生成企业名片文案", output: "card" },
    diagnosis: { title: "AI页面诊断", prompt: "请诊断页面并给出优化建议", output: "diagnosis" },
    video15: { title: "15秒脚本", prompt: "请生成15秒短视频脚本", output: "video15" },
    video30: { title: "30秒脚本", prompt: "请生成30秒短视频脚本", output: "video30" },
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeParse(json, fallback) {
    try {
      const value = JSON.parse(json);
      return value && typeof value === "object" ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function loadAdminData() {
    if (typeof localStorage === "undefined") return { ...DEFAULT_ADMIN };
    return { ...DEFAULT_ADMIN, ...safeParse(localStorage.getItem(STORAGE.admin), {}) };
  }

  function saveAdminData(data) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE.admin, JSON.stringify(data));
  }

  function loadInquiries() {
    if (typeof localStorage === "undefined") return [];
    return safeParse(localStorage.getItem(STORAGE.inquiries), []);
  }

  function saveInquiries(items) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE.inquiries, JSON.stringify(items.slice(0, 12)));
  }

  function loadDrafts() {
    if (typeof localStorage === "undefined") return {};
    return safeParse(localStorage.getItem(STORAGE.draft), {});
  }

  function saveDrafts(data) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE.draft, JSON.stringify(data));
  }

  function getIndustryMeta(value) {
    return INDUSTRY_MAP[value] || INDUSTRY_MAP.other;
  }

  function getWorkbenchData(workbench) {
    const admin = loadAdminData();
    const values = {};
    qsa('input[name], select[name], textarea[name]', workbench).forEach((field) => {
      values[field.name] = field.value;
    });
    return {
      ...admin,
      ...values,
      industry: values.industry || admin.industry || "other",
      industryName: getIndustryMeta(values.industry || admin.industry || "other").name,
    };
  }

  function formatLines(lines) {
    return lines.filter(Boolean).join("\n");
  }

  function getBulletList(items, title) {
    return formatLines([title, ...items.map((item) => `- ${item}`)]);
  }

  function buildIntro(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `${data.enterprise}是一家面向${industry.name}客户的企业，主要围绕${data.business}提供服务。`,
      `公司目前聚焦${data.products}，同时结合${data.equipment}等能力，帮助客户快速看懂我们的实力。`,
      `我们希望把复杂的业务说简单，把客户最关心的交期、质量、报价和联系方式放在最前面。`,
      `企业优势：${data.advantage}。`,
      `联系信息：电话 ${data.phone}，微信 ${data.wechat}，邮箱 ${data.email}。`,
    ]);
  }

  function buildProduct(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `${data.enterprise}的${industry.name}产品/服务介绍：`,
      `主营内容：${data.products}。`,
      `业务场景：${data.business}，适合需要快速沟通、明确参数和稳定交付的客户。`,
      `设备能力：${data.equipment}。`,
      `核心优势：${data.advantage}。`,
      `客户可以直接通过电话或微信联系，提交需求后快速确认合作方向。`,
    ]);
  }

  function buildPromote(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `朋友圈文案：`,
      `${data.enterprise}，专注${industry.name}相关业务，主做${data.products}。`,
      `我们把设备能力、产品展示、客户入口都放在页面里，让客户一眼看懂能不能合作。`,
      `欢迎有需求的朋友直接联系，电话 ${data.phone}，微信 ${data.wechat}。`,
      ``,
      `百度/抖音可用版本：`,
      `企业名称：${data.enterprise}`,
      `主营业务：${data.business}`,
      `关键词方向：${industry.name}、${data.products}、${data.advantage}`,
    ]);
  }

  function buildAnalysis(data) {
    const score = Math.min(98, 68 + Math.min(String(data.products || "").length, 20));
    const type = score >= 85 ? "高意向客户" : score >= 75 ? "可重点跟进客户" : "普通咨询客户";
    return formatLines([
      `客户分析结果：`,
      `客户类型：${type}`,
      `合作评分：${score}/100`,
      `关注点：价格、交期、能力展示、联系方式是否清楚。`,
      `建议动作：先给对方看设备、案例、联系人，再补充报价或服务边界。`,
      `当前企业最该强化的是：${data.advantage}。`,
    ]);
  }

  function buildAdvice(data) {
    const positive = data.budget && !String(data.budget).includes("待");
    const caution = String(data.risk || "").trim();
    const recommendation = positive ? "建议接单" : "建议先沟通再接单";
    return formatLines([
      `接单建议：${recommendation}`,
      `判断依据：${positive ? "预算已较明确，合作推进更顺" : "预算信息还不够明确，先确认需求更稳妥"}`,
      caution ? `风险提示：${caution}。` : "风险提示：先确认材料、工艺、交期和验收标准。",
      `建议话术：先让客户发需求，再对齐数量、材料、工艺和交期，然后给出报价和下一步安排。`,
    ]);
  }

  function buildFind(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `获客建议：`,
      `1. 百度搜索：围绕“${industry.name} + ${data.products}”做标题和内容页。`,
      `2. 微信转发：把页面链接发给老客户、业务员和合作伙伴。`,
      `3. 朋友圈分享：用设备照片、案例和老板名片做展示。`,
      `4. 抖音企业主页：放主页链接，配 15 秒/30 秒视频脚本。`,
      `5. 线下扫码：展会、名片、车间门口、宣传海报都能用。`,
    ]);
  }

  function buildFollow(data) {
    return formatLines([
      `跟进提醒：`,
      `首次回复：您好，已经收到您的需求，我们先核对产品名称、数量、材料和工艺。`,
      `报价沟通：如方便，请补充图纸或现场照片，我们尽快给您报价。`,
      `未成交维护：后续如有新项目，也欢迎继续联系 ${data.enterprise}。`,
    ]);
  }

  function buildPlan(data) {
    return formatLines([
      `自动运营计划：`,
      `今天：更新一条企业动态，补充一张设备或产品照片。`,
      `本周：生成一篇产品介绍、一个朋友圈文案和一个短视频脚本。`,
      `本月：整理一个客户案例、一个报价沟通模板和一个 FAQ 页面。`,
      `渠道：百度、微信、抖音、行业群、线下扫码同步分发。`,
    ]);
  }

  function buildRecruit(data) {
    return formatLines([
      `招聘文案：`,
      `${data.enterprise}正在招聘能长期稳定合作的伙伴，主要围绕${data.business}展开。`,
      `岗位可写成：业务助理、技术员、操作工、客服/跟单等。`,
      `公司优势：${data.advantage}。`,
      `联系方式：电话 ${data.phone}，微信 ${data.wechat}。`,
    ]);
  }

  function buildCard(data) {
    return formatLines([
      `${data.enterprise}`,
      `主营：${data.business}`,
      `产品/服务：${data.products}`,
      `优势：${data.advantage}`,
      `电话：${data.phone}`,
      `微信：${data.wechat}`,
    ]);
  }

  function buildDiagnosis(data) {
    return formatLines([
      `页面诊断：`,
      `1. 是否写清企业名称：${data.enterprise ? "已包含" : "需补充"}`,
      `2. 是否突出主营业务：${data.business ? "已包含" : "需补充"}`,
      `3. 是否展示设备能力：${data.equipment ? "已包含" : "需补充"}`,
      `4. 是否放出联系方式：${data.phone && data.wechat ? "已包含" : "需补充"}`,
      `5. 是否有客户入口：建议放在首屏和页底。`,
    ]);
  }

  function buildVideo15(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `15秒短视频脚本：`,
      `开头：${data.enterprise}，专注${industry.name}，主做${data.products}。`,
      `中段：展示设备、车间和产品，强调${data.advantage}。`,
      `结尾：有需求直接联系 ${data.phone}，微信 ${data.wechat}。`,
    ]);
  }

  function buildVideo30(data) {
    const industry = getIndustryMeta(data.industry);
    return formatLines([
      `30秒短视频脚本：`,
      `1. 开场展示企业名称和主营业务：${data.enterprise}，专注${industry.name}。`,
      `2. 中段展示设备和产品：${data.equipment}，主要服务${data.products}。`,
      `3. 说明合作价值：${data.advantage}。`,
      `4. 结尾引导联系：电话 ${data.phone}，微信 ${data.wechat}。`,
    ]);
  }

  const LOCAL_BUILDERS = {
    intro: buildIntro,
    product: buildProduct,
    promote: buildPromote,
    analysis: buildAnalysis,
    advice: buildAdvice,
    find: buildFind,
    follow: buildFollow,
    plan: buildPlan,
    recruit: buildRecruit,
    card: buildCard,
    diagnosis: buildDiagnosis,
    video15: buildVideo15,
    video30: buildVideo30,
  };

  function buildPrompt(action, data) {
    const meta = ACTION_META[action];
    return `${meta ? meta.prompt : action}\n\n企业名称：${data.enterprise}\n行业：${getIndustryMeta(data.industry).name}\n主营业务：${data.business}\n产品/服务：${data.products}\n设备能力：${data.equipment}\n企业优势：${data.advantage}\n联系电话：${data.phone}\n微信号：${data.wechat}`;
  }

  async function requestDeepSeek(action, data) {
    const response = await fetch("/api/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        model: "deepseek-chat",
        prompt: buildPrompt(action, data),
        payload: data,
      }),
    });
    if (!response.ok) {
      throw new Error(`api:${response.status}`);
    }
    const body = await response.json();
    return (
      body.content ||
      body.result ||
      body.text ||
      body.data?.content ||
      body.choices?.[0]?.message?.content ||
      ""
    ).trim();
  }

  function generateLocal(action, data) {
    const builder = LOCAL_BUILDERS[action] || LOCAL_BUILDERS.intro;
    return builder(data);
  }

  function renderConfig(data) {
    qsa("[data-config]").forEach((node) => {
      const key = node.getAttribute("data-config");
      const value = data[key] ?? data[key === "product" ? "products" : key] ?? "";
      node.textContent = value;
    });

    qsa("[data-phone-link]").forEach((node) => {
      node.setAttribute("href", `tel:${String(data.phone || DEFAULT_ADMIN.phone).replace(/\s+/g, "")}`);
    });

    qsa("[data-copy-wechat]").forEach((node) => {
      node.dataset.copyValue = data.wechat || DEFAULT_ADMIN.wechat;
    });
  }

  function renderInquiryList() {
    const list = loadInquiries();
    qsa("[data-inquiry-list]").forEach((root) => {
      root.innerHTML = "";
      if (!list.length) {
        const empty = document.createElement("div");
        empty.className = "record";
        empty.textContent = "暂无询盘，提交后会显示在这里。";
        root.appendChild(empty);
        return;
      }

      list.slice(0, 8).forEach((item) => {
        const row = document.createElement("div");
        row.className = "record";
        row.innerHTML = `
          <strong>${item.name || "匿名客户"} · ${item.product || "需求咨询"}</strong>
          <span>联系方式：${item.contact || "-"} ｜ 数量：${item.quantity || "-"} ｜ 来源：${item.source || "-"} </span>
        `;
        root.appendChild(row);
      });
    });
  }

  function saveInquiry(entry) {
    const list = loadInquiries();
    list.unshift(entry);
    saveInquiries(list);
    renderInquiryList();
  }

  function setMessage(target, text, variant = "info") {
    if (!target) return;
    target.textContent = text;
    target.dataset.variant = variant;
    target.classList.add("show");
  }

  function hideMessage(target) {
    if (!target) return;
    target.classList.remove("show");
    target.textContent = "";
  }

  function setLoading(workbench, action, loading) {
    const output = qs(`[data-ai-output="${action}"]`, workbench);
    const status = qs("[data-ai-status]", workbench);
    const loader = qs("[data-ai-loader]", workbench);
    const meta = ACTION_META[action];
    if (output) {
      output.classList.toggle("is-loading", loading);
      if (loading) {
        output.textContent = "正在生成内容...";
      }
    }
    if (loader) {
      loader.hidden = !loading;
    }
    if (loading && status && meta) {
      status.textContent = loading ? `正在生成 ${meta.title} ...` : `当前结果：${meta.title}`;
    }
  }

  function setOutput(workbench, action, text) {
    const output = qs(`[data-ai-output="${action}"]`, workbench);
    if (!output) return;
    output.textContent = text || "点击按钮生成内容。";
    output.classList.remove("is-loading");
    const drafts = loadDrafts();
    drafts[action] = text;
    saveDrafts(drafts);
  }

  function getActiveAction(workbench) {
    return workbench?.dataset.activeAction || "intro";
  }

  function setActiveAction(workbench, action) {
    if (!workbench) return;
    workbench.dataset.activeAction = action;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE.activeAction, action);
    }
  }

  async function runAction(workbench, action, options = {}) {
    const data = getWorkbenchData(workbench);
    const meta = ACTION_META[action] || ACTION_META.intro;
    setActiveAction(workbench, action);
    setLoading(workbench, action, true);
    await new Promise((resolve) => setTimeout(resolve, 240));

    let text = "";
    if (!options.localOnly) {
      try {
        text = await requestDeepSeek(action, data);
      } catch {
        text = "";
      }
    }

    if (!text) {
      text = generateLocal(action, data);
      const status = qs("[data-ai-status]", workbench);
      if (status) {
        status.textContent = `当前结果：${meta.title} · 本地模板生成`;
      }
    } else {
      const status = qs("[data-ai-status]", workbench);
      if (status) {
        status.textContent = `当前结果：${meta.title} · DeepSeek 接口返回`;
      }
    }

    setOutput(workbench, action, text);
    setLoading(workbench, action, false);
    return text;
  }

  function copyText(text) {
    if (!text) return Promise.reject(new Error("empty"));
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  function exportText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function animateCounter(node, target) {
    const duration = 900;
    const start = performance.now();
    const initial = 0;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(initial + (target - initial) * progress);
      node.textContent = target >= 1000 ? value.toLocaleString("zh-CN") : String(value);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  function bindRevealMotion() {
    qsa(".card, .panel, .feature-card, .stat-card, .dash-card, .success-card, .compare-card").forEach((el) => {
      el.classList.add("reveal");
    });

    if (!("IntersectionObserver" in window)) {
      qsa(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    qsa(".reveal").forEach((el) => observer.observe(el));
  }

  function bindCounters() {
    qsa("[data-count]").forEach((node) => {
      const target = Number(node.getAttribute("data-count") || 0);
      animateCounter(node, target);
    });
  }

  function bindDemo() {
    const startButton = qs("[data-demo-start]");
    const log = qs("[data-demo-log]");
    const preview = qs("[data-demo-preview]");
    const bar = qs("[data-demo-progress]");
    if (!startButton || !log || !preview || !bar) return;

    const steps = [
      "AI 正在分析企业信息……",
      "正在生成企业简介……",
      "正在生成产品介绍……",
      "正在生成产品图片……",
      "正在生成官网……",
      "正在优化 SEO……",
      "正在部署网站……",
    ];

    startButton.addEventListener("click", async () => {
      const enterprise = qs('input[name="demoEnterprise"]')?.value?.trim() || "示例企业";
      const business = qs('input[name="demoBusiness"]')?.value?.trim() || "主营业务";
      const industry = qs('select[name="demoIndustry"]')?.value || "制造业";
      log.innerHTML = "";
      preview.textContent = "生成中...";
      bar.style.width = "0%";

      for (let i = 0; i < steps.length; i += 1) {
        const row = document.createElement("div");
        row.textContent = steps[i];
        log.appendChild(row);
        bar.style.width = `${Math.min(100, ((i + 1) / steps.length) * 100)}%`;
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      const finish = document.createElement("div");
      finish.textContent = "生成完成 ✓";
      finish.className = "demo-finish";
      log.appendChild(finish);
      preview.textContent = `${enterprise} · ${industry} · ${business}\n官网、产品介绍、招聘页面、询盘系统与 AI 客服已生成。`;
    });
  }

  function bindAssistant() {
    const shell = qs("[data-ai-assistant]");
    if (!shell) return;
    const toggle = qs("[data-assistant-toggle]", shell);
    const panel = qs(".ai-float-panel", shell);
    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
      const show = panel.hidden;
      panel.hidden = !show;
      shell.classList.toggle("open", show);
    });

    qsa("[data-assistant-action]", shell).forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.assistantAction;
        const targets = {
          generator: "ai-center.html#generator",
          product: "ai-center.html#product",
          recruit: "ai-center.html#recruit",
          quote: "quote.html",
        };
        window.location.href = targets[action] || "index.html#demo";
      });
    });
  }

  function bindWorkbench(workbench) {
    const industrySelect = qs('select[name="industry"]', workbench);
    const status = qs("[data-ai-status]", workbench);
    const drafts = loadDrafts();

    if (industrySelect) {
      industrySelect.addEventListener("change", () => {
        const meta = getIndustryMeta(industrySelect.value);
        const template = qs("[data-industry-template]", workbench);
        if (template) {
          template.textContent = `${meta.name}模板：${meta.template}`;
        }
        const products = workbench.querySelector('input[name="products"]');
        const business = workbench.querySelector('input[name="business"]');
        const equipment = workbench.querySelector('input[name="equipment"]');
        const advantage = workbench.querySelector('input[name="advantage"], textarea[name="advantage"]');
        if (products && (!products.value || products.value === DEFAULT_ADMIN.products)) products.value = meta.products;
        if (business && (!business.value || business.value === DEFAULT_ADMIN.business)) business.value = meta.business;
        if (equipment && (!equipment.value || equipment.value === DEFAULT_ADMIN.equipment)) equipment.value = meta.template;
        if (advantage && (!advantage.value || advantage.value === DEFAULT_ADMIN.advantage)) advantage.value = meta.advantage || DEFAULT_ADMIN.advantage;
        if (status) {
          status.textContent = `已切换到 ${meta.name} 模板`;
        }
      });
      const currentMeta = getIndustryMeta(industrySelect.value);
      const template = qs("[data-industry-template]", workbench);
      if (template) {
        template.textContent = `${currentMeta.name}模板：${currentMeta.template}`;
      }
    }

    qsa("[data-ai-action]", workbench).forEach((button) => {
      button.addEventListener("click", async () => {
        const action = button.dataset.aiAction;
        const text = await runAction(workbench, action);
        setActiveAction(workbench, action);
        const stored = loadDrafts();
        if (stored[action]) {
          setOutput(workbench, action, stored[action]);
        } else if (drafts[action]) {
          setOutput(workbench, action, drafts[action]);
        } else {
          setOutput(workbench, action, text);
        }
      });
    });

    const copyButton = qs("[data-ai-copy]", workbench);
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const action = getActiveAction(workbench);
        const output = qs(`[data-ai-output="${action}"]`, workbench);
        const text = output?.textContent?.trim() || "";
        if (!text) return;
        await copyText(text);
        const status = qs("[data-ai-status]", workbench);
        if (status) {
          status.textContent = "内容已复制，可直接粘贴发送。";
        }
      });
    }

    const regenButton = qs("[data-ai-regenerate]", workbench);
    if (regenButton) {
      regenButton.addEventListener("click", async () => {
        const action = getActiveAction(workbench);
        await runAction(workbench, action);
      });
    }

    const exportButton = qs("[data-ai-export]", workbench);
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        const action = getActiveAction(workbench);
        const output = qs(`[data-ai-output="${action}"]`, workbench);
        const text = output?.textContent?.trim() || "";
        if (!text) return;
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        exportText(`liqi-ai-${action}-${stamp}.txt`, text);
      });
    }

    const firstAction = getActiveAction(workbench);
    if (firstAction && qs(`[data-ai-output="${firstAction}"]`, workbench)?.textContent?.trim() === "点击按钮生成内容。") {
      const draftText = drafts[firstAction];
      if (draftText) {
        setOutput(workbench, firstAction, draftText);
      }
    }

    if (status) {
      status.textContent = `当前结果：${ACTION_META[firstAction]?.title || "AI内容"}`;
    }
  }

  function bindAdminForm() {
    const form = qs("[data-admin-form]");
    if (!form) return;
    const successBox = qs("[data-admin-success]");
    const imageHint = qs("[data-image-hint]");
    const data = loadAdminData();

    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field && field.type !== "file") {
        field.value = value;
      }
    });

    const copyWechat = qs("[data-copy-wechat]");
    if (copyWechat) {
      copyWechat.addEventListener("click", async () => {
        const current = loadAdminData().wechat || DEFAULT_ADMIN.wechat;
        await copyText(current);
        if (successBox) {
          setMessage(successBox, "微信号已复制。", "success");
        }
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const next = loadAdminData();
      for (const [key, value] of formData.entries()) {
        if (key === "images") continue;
        next[key] = String(value);
      }
      saveAdminData(next);
      renderConfig(next);
      if (successBox) {
        setMessage(successBox, "保存成功，前台展示内容已更新。", "success");
      }
      if (imageHint) {
        const files = form.elements.namedItem("images")?.files;
        imageHint.textContent = files && files.length ? `已选择 ${files.length} 张图片，当前为演示保存。` : "资料已保存到当前浏览器。";
      }
    });

    const imageInput = form.elements.namedItem("images");
    if (imageInput) {
      imageInput.addEventListener("change", () => {
        if (imageHint) {
          const files = imageInput.files || [];
          imageHint.textContent = files.length ? `已选择 ${files.length} 张图片，当前仅做前端演示。` : "暂未选择图片";
        }
      });
    }
  }

  function bindInquiryForms() {
    qsa("[data-inquiry-form]").forEach((form) => {
      const success = qs("[data-success]", form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const entry = {
          name: String(formData.get("name") || ""),
          contact: String(formData.get("contact") || ""),
          product: String(formData.get("product") || ""),
          quantity: String(formData.get("quantity") || ""),
          note: String(formData.get("note") || ""),
          source: String(formData.get("source") || "网页提交"),
          time: new Date().toLocaleString("zh-CN"),
        };
        saveInquiry(entry);
        form.reset();
        const source = form.querySelector('input[name="source"]');
        if (source) source.value = entry.source;
        if (success) {
          setMessage(success, "提交成功，您的询盘已生成。企业老板可根据您的电话或微信联系您。", "success");
        }
      });
    });
  }

  function boot() {
    const admin = loadAdminData();
    renderConfig(admin);
    renderInquiryList();
    bindAdminForm();
    bindInquiryForms();
    qsa("[data-ai-workbench]").forEach(bindWorkbench);
    bindDemo();
    bindAssistant();
    bindRevealMotion();
    bindCounters();

    const drafts = loadDrafts();
    Object.entries(drafts).forEach(([action, text]) => {
      qsa(`[data-ai-output="${action}"]`).forEach((node) => {
        if (node.textContent?.trim() === "点击按钮生成内容。" && text) {
          node.textContent = text;
        }
      });
    });

    const active = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE.activeAction) : "";
    if (active) {
      qsa("[data-ai-workbench]").forEach((workbench) => {
        if (qs(`[data-ai-output="${active}"]`, workbench)) {
          setActiveAction(workbench, active);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
