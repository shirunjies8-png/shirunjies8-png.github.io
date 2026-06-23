(function () {
  const STORAGE_CONFIG = "liqiAiAdminData";
  const STORAGE_INQUIRIES = "liqiAiInquiries";
  const STORAGE_AI_DRAFT = "liqiAiAiDraft";

  const defaultConfig = {
    phone: "13961109605",
    wechat: "liqi-ai-demo",
    email: "1105349573@qq.com",
    product: "企业产品/服务展示",
    equipment: "服务经验、产品能力、案例成果、联系方式"
  };

  const starterInquiries = [
    {
      name: "张先生",
      contact: "138****2688",
      product: "合作咨询",
      quantity: "待确认",
      note: "想了解产品/服务内容和合作方式",
      source: "微信转发"
    },
    {
      name: "李经理",
      contact: "微信：li****88",
      product: "服务预约",
      quantity: "1次",
      note: "希望先沟通需求和时间安排",
      source: "客户扫码"
    }
  ];

  const industryTemplates = {
    machining: {
      label: "机械加工",
      business: "机械加工",
      products: "CNC加工、数控车加工、来样来图需求",
      demand: "加工咨询、文件评估、打样和批量生产",
      modules: "设备、产品、加工能力、提交需求"
    },
    sheetmetal: {
      label: "钣金焊接",
      business: "钣金焊接",
      products: "激光切割、折弯、焊接结构件",
      demand: "设备支架、机箱外壳、结构件合作咨询",
      modules: "设备、工艺、案例、提交需求"
    },
    automation: {
      label: "自动化设备",
      business: "自动化设备",
      products: "自动化设备、产线改造、非标设备",
      demand: "方案咨询、设备选型、项目合作",
      modules: "方案、案例、服务流程、联系方式"
    },
    energy: {
      label: "新能源",
      business: "新能源配套",
      products: "新能源零部件、配套加工、项目协作",
      demand: "配套咨询、样品评估、批量合作",
      modules: "产品、资质、案例、合作入口"
    },
    food: {
      label: "食品加工",
      business: "食品加工",
      products: "食品产品、生产环境、销售渠道",
      demand: "批发合作、渠道咨询、产品采购",
      modules: "产品、生产环境、资质证书、销售渠道"
    },
    packaging: {
      label: "包装印刷",
      business: "包装印刷",
      products: "包装设计、印刷服务、定制包装",
      demand: "包装定制、打样、批量印刷",
      modules: "样品、材质、工艺、提交需求"
    },
    ecommerce: {
      label: "电商企业",
      business: "电商经营",
      products: "主推产品、卖点、用户评价、购买方式",
      demand: "产品咨询、渠道合作、批量采购",
      modules: "产品、卖点、评价、购买方式"
    },
    service: {
      label: "服务行业",
      business: "本地服务",
      products: "服务内容、案例、价格说明、联系方式",
      demand: "服务咨询、预约、合作沟通",
      modules: "服务内容、案例、价格说明、联系方式"
    },
    other: {
      label: "其他行业",
      business: "企业服务",
      products: "产品/服务、企业优势、客户案例",
      demand: "合作咨询、报价需求、业务沟通",
      modules: "企业展示、产品/服务、联系方式、客户入口"
    }
  };

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getConfig() {
    return { ...defaultConfig, ...readJSON(STORAGE_CONFIG, {}) };
  }

  function applyConfig() {
    const config = getConfig();
    document.querySelectorAll("[data-config]").forEach((node) => {
      const key = node.getAttribute("data-config");
      node.textContent = config[key] || "";
    });
    document.querySelectorAll("[data-phone-link]").forEach((node) => {
      node.setAttribute("href", "tel:" + config.phone);
    });
    document.querySelectorAll("[data-mail-link]").forEach((node) => {
      node.setAttribute("href", "mailto:" + config.email);
    });
  }

  function getInquiries() {
    return readJSON(STORAGE_INQUIRIES, starterInquiries);
  }

  function renderInquiries() {
    const list = document.querySelector("[data-inquiry-list]");
    if (!list) return;
    const inquiries = getInquiries();
    list.innerHTML = inquiries
      .slice()
      .reverse()
      .map((item) => {
        return `
          <div class="record">
            <strong>${escapeHTML(item.name)} · ${escapeHTML(item.product)}</strong>
            <span>联系方式：${escapeHTML(item.contact)}｜数量：${escapeHTML(item.quantity)}｜来源：${escapeHTML(item.source || "网页询盘")}</span>
            <span>${escapeHTML(item.note || "等待报价沟通")}</span>
          </div>
        `;
      })
      .join("");
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function bindInquiryForms() {
    document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const record = {
          name: data.get("name") || "客户",
          contact: data.get("contact") || "待补充",
          product: data.get("product") || "合作咨询",
          quantity: data.get("quantity") || "待确认",
          note: data.get("note") || "客户已提交询盘",
          source: data.get("source") || "网页询盘"
        };
        const inquiries = getInquiries();
        inquiries.push(record);
        saveJSON(STORAGE_INQUIRIES, inquiries);
        form.reset();
        const success = document.querySelector("[data-success]");
        if (success) {
          success.classList.add("show");
          success.innerHTML = "提交成功<br>您的询盘已生成<br>企业老板可根据您的电话或微信联系您";
        }
        renderInquiries();
      });
    });
  }

  function bindWechatButtons() {
    document.querySelectorAll("[data-copy-wechat]").forEach((button) => {
      button.addEventListener("click", async () => {
        const wechat = getConfig().wechat;
        try {
          await navigator.clipboard.writeText(wechat);
          button.textContent = "微信号已复制";
        } catch (error) {
          button.textContent = "微信号：" + wechat;
        }
      });
    });
  }

  function bindAdmin() {
    const form = document.querySelector("[data-admin-form]");
    if (!form) return;
    const config = getConfig();
    Object.keys(config).forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = config[key];
    });

    const imageInput = form.querySelector('[name="images"]');
    const imageHint = document.querySelector("[data-image-hint]");
    if (imageInput && imageHint) {
      imageInput.addEventListener("change", () => {
        const names = Array.from(imageInput.files || []).map((file) => file.name);
        imageHint.textContent = names.length ? "已选择：" + names.join("、") : "暂未选择图片";
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const nextConfig = {
        phone: data.get("phone"),
        wechat: data.get("wechat"),
        email: data.get("email"),
        product: data.get("product"),
        equipment: data.get("equipment")
      };
      saveJSON(STORAGE_CONFIG, nextConfig);
      applyConfig();
      const success = document.querySelector("[data-admin-success]");
      if (success) {
        success.classList.add("show");
        success.textContent = "保存成功，前台展示内容已更新";
      }
    });
  }

  function buildAiResponse(action, payload) {
    const template = industryTemplates[payload.industry] || industryTemplates.other;
    const enterprise = payload.enterprise || "溧企AI示例企业";
    const business = payload.business || template.business;
    const products = payload.products || template.products;
    const contact = payload.contact || "电话、微信";
    const customer = payload.customer || "潜在客户";
    const demand = payload.demand || template.demand;
    const budget = payload.budget || "预算待确认";
    const risk = payload.risk || "价格、交付、服务边界";

    const responses = {
      intro: `企业简介（通用版）\n${enterprise} 是一家专注${business}的企业，主营${products}，面向客户提供清晰、可靠、方便沟通的产品与服务。\n\n企业简介（销售版）\n如果你正在找${business}相关合作，可以先把需求发给${enterprise}。我们会根据你的情况整理需求、确认细节，并给出下一步沟通建议。\n\n企业简介（简洁版）\n${enterprise}，主营${products}，支持在线咨询和提交需求。\n\n推荐页面结构\n${template.modules}\n\n客户入口\n${contact}`,
      product: `产品介绍\n${enterprise} 的核心产品是 ${products}。\n\n客户能看懂的说法\n我们把复杂工艺讲简单，让客户知道材料、工艺、交期和价格怎么来的。\n\n适合的客户需求\n${demand}`,
      promote: `推广文案\n想了解${business}，可以先看看${enterprise}的企业页面。\n\n页面里有企业介绍、产品/服务、图片展示、客户入口和联系方式，适合微信转发、朋友圈分享、百度搜索、抖音主页和线下扫码。\n\n联系入口：${contact}`,
      analysis: `客户分析\n客户名称：${customer}\n客户需求：${demand}\n预算判断：${budget}\n主要风险：${risk}\n\n建议\n优先级：中高\n客户类型：有明确需求的咨询客户\n下一步：尽快确认需求内容、预算范围、交付时间和联系方式。`,
      advice: `接单建议\n是否建议接单：建议跟进\n原因：需求比较明确，可以先沟通细节，再判断预算、交付和服务边界。\n风险提示：注意价格预期、交付时间、服务范围和付款方式。\n\n合作策略\n先确认需求，再给方案或报价；复杂需求先做小范围沟通。`,
      find: `获客建议\n客户来源：百度搜索、微信转发、朋友圈分享、抖音企业主页、老客户介绍、线下扫码、行业群。\n\n推荐渠道\n优先发布企业页、产品/服务页、案例页和提交需求入口。\n\n每日动作\n更新一条动态、补一张图片、发一条朋友圈、同步一个案例、回复一个询盘。`,
      follow: `跟进提醒\n当前有 1 个客户未跟进。\n建议联系：张先生\n原因：已经提交需求，沟通窗口还在。\n下一步：确认需求内容、预算范围、交付时间和联系方式。`,
      plan: `自动运营建议\n今日动作：更新一个产品/服务、补一张图片、发一条朋友圈、同步一个案例、检查客户入口。\n\n标题建议\n${enterprise} | ${business} | 在线咨询\n\n关键词建议\n${business}、${products}、企业展示、客户咨询、联系方式\n\n外部动态维护\n可以根据行业新闻、政策变化、节日节点和市场热点生成企业动态，但正式发布前建议老板确认内容。`,
      video15: `15秒脚本\n1秒：我们做${products}。\n5秒：可展示产品/服务、案例和联系方式。\n10秒：客户扫码就能联系。\n15秒：点击主页提交需求。`,
      video30: `30秒脚本\n开头：${enterprise} 专注${business}。\n中段：展示产品/服务、现场图片、案例和客户反馈。\n结尾：支持微信联系、提交需求、快速沟通。`,
      recruit: `招聘文案\n${enterprise} 招聘${business}相关岗位。\n\n岗位说明\n负责日常业务协作、客户沟通、产品/服务整理和现场支持。\n\n朋友圈招聘内容\n我们正在招人，欢迎踏实靠谱、愿意长期发展的朋友联系。`,
      card: `AI名片\n一句话介绍：${enterprise}，主营${products}。\n主营：${business}\n联系方式：${contact}\n二维码：可使用当前公网链接生成。`,
      diagnosis: `页面诊断\n信息完整度：良好\n联系方式：需要放在首页、底部和悬浮按钮\n图片展示：建议至少上传产品/服务、现场、案例、资质图片\n客户入口：建议统一为“提交需求”\n优化建议：减少行业黑话，多写客户能看懂的服务结果。`
    };

    return responses[action] || "未生成内容";
  }

  function bindAiWorkbench() {
    const shell = document.querySelector("[data-ai-workbench]");
    if (!shell) return;

    const readPayload = () => ({
      industry: shell.querySelector('[name="industry"]')?.value,
      enterprise: shell.querySelector('[name="enterprise"]')?.value.trim(),
      business: shell.querySelector('[name="business"]')?.value.trim(),
      products: shell.querySelector('[name="products"]')?.value.trim(),
      contact: shell.querySelector('[name="contact"]')?.value.trim(),
      customer: shell.querySelector('[name="customer"]')?.value.trim(),
      demand: shell.querySelector('[name="demand"]')?.value.trim(),
      budget: shell.querySelector('[name="budget"]')?.value.trim(),
      risk: shell.querySelector('[name="risk"]')?.value.trim()
    });

    const applyIndustryTemplate = () => {
      const selected = shell.querySelector('[name="industry"]');
      const template = industryTemplates[selected?.value] || industryTemplates.other;
      const business = shell.querySelector('[name="business"]');
      const products = shell.querySelector('[name="products"]');
      const demand = shell.querySelector('[name="demand"]');
      if (business) business.value = template.business;
      if (products) products.value = template.products;
      if (demand) demand.value = template.demand;
      shell.querySelectorAll("[data-industry-template]").forEach((node) => {
        node.textContent = `${template.label}模板：${template.modules}`;
      });
    };

    const render = (action) => {
      const output = shell.querySelector(`[data-ai-output="${action}"]`);
      if (!output) return;
      const text = buildAiResponse(action, readPayload());
      output.textContent = text;
      const draft = readJSON(STORAGE_AI_DRAFT, {});
      draft[action] = text;
      saveJSON(STORAGE_AI_DRAFT, draft);
    };

    shell.querySelectorAll("[data-ai-action]").forEach((button) => {
      button.addEventListener("click", () => render(button.getAttribute("data-ai-action")));
    });

    shell.querySelectorAll('[name="industry"]').forEach((select) => {
      select.addEventListener("change", applyIndustryTemplate);
    });

    const draft = readJSON(STORAGE_AI_DRAFT, {});
    Object.keys(draft).forEach((key) => {
      const output = shell.querySelector(`[data-ai-output="${key}"]`);
      if (output) output.textContent = draft[key];
    });

    applyIndustryTemplate();
  }

  applyConfig();
  bindInquiryForms();
  bindWechatButtons();
  bindAdmin();
  bindAiWorkbench();
  renderInquiries();
})();
