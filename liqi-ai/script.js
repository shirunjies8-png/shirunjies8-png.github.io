(function () {
  const STORAGE_CONFIG = "liqiAiAdminData";
  const STORAGE_INQUIRIES = "liqiAiInquiries";
  const STORAGE_AI_DRAFT = "liqiAiAiDraft";

  const defaultConfig = {
    phone: "13961109605",
    wechat: "liqi-ai-demo",
    email: "1105349573@qq.com",
    product: "不锈钢零部件 CNC 加工",
    equipment: "CNC加工中心 5台，数控车床 10台，激光切割机 2台，三坐标检测仪 1台"
  };

  const starterInquiries = [
    {
      name: "张先生",
      contact: "138****2688",
      product: "不锈钢轴套",
      quantity: "500件",
      note: "需要按图纸报价，交期越快越好",
      source: "微信转发"
    },
    {
      name: "李经理",
      contact: "微信：li****88",
      product: "设备支架",
      quantity: "80套",
      note: "钣金焊接件，小批量试制",
      source: "客户扫码"
    }
  ];

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
          product: data.get("product") || "来图加工",
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
    const enterprise = payload.enterprise || "溧企AI示例企业";
    const business = payload.business || "制造加工";
    const products = payload.products || "产品/服务";
    const contact = payload.contact || "电话、微信";
    const customer = payload.customer || "潜在客户";
    const demand = payload.demand || "来图加工、报价、下单";
    const budget = payload.budget || "预算待确认";
    const risk = payload.risk || "交期、工艺、账期";

    const responses = {
      intro: `企业简介\n${enterprise} 专注${business}，主营${products}，面向客户提供从咨询、报价、打样到批量交付的服务。\n\n客户入口\n${contact}\n\n客户最关心的问题\n能不能接订单、能不能展示实力、客户能不能快速联系。`,
      product: `产品介绍\n${enterprise} 的核心产品是 ${products}。\n\n客户能看懂的说法\n我们把复杂工艺讲简单，让客户知道材料、工艺、交期和价格怎么来的。\n\n适合的客户需求\n${demand}`,
      promote: `推广文案\n想找${business}的客户，可以直接联系${enterprise}。\n\n我们支持产品展示、设备展示、来图报价、微信联系，适合微信转发、朋友圈分享、百度搜索和抖音主页。\n\n联系入口：${contact}`,
      analysis: `客户分析\n客户名称：${customer}\n客户需求：${demand}\n预算判断：${budget}\n主要风险：${risk}\n\n建议\n优先级：中高\n客户类型：有明确需求的询盘客户\n下一步：尽快确认图纸、数量、材料和交期。`,
      advice: `接单建议\n是否建议接单：建议跟进\n原因：需求清楚，沟通成本较低，适合先做报价和打样。\n风险提示：注意交期、付款方式和工艺确认。\n\n报价策略\n先给标准报价，再给加急/批量价。`,
      find: `找客户建议\n客户来源：百度搜索、微信转发、朋友圈分享、抖音企业主页、老客户介绍。\n\n推荐渠道\n优先发布产品页、设备页、案例页和来图报价页。\n\n每日动作\n更新一个产品、发一条朋友圈、同步一条案例、回复一个询盘。`,
      follow: `跟进提醒\n当前有 1 个客户未跟进。\n建议联系：张先生\n原因：已经提交询盘，报价窗口还在。\n下一步：补充图纸、数量、材料、交期。`,
      plan: `自动运营建议\n今日动作：更新一个产品、补一张设备图、发一条朋友圈、同步一条案例。\n\n标题建议\n${enterprise} | ${business} | 来图报价\n\n关键词建议\n${business}、${products}、来图加工、设备展示、微信报价`,
      video15: `15秒脚本\n1秒：我们做${products}。\n5秒：可提供产品展示、设备展示和来图报价。\n10秒：客户扫码就能联系。\n15秒：点击主页获取报价。`,
      video30: `30秒脚本\n开头：${enterprise} 专注${business}。\n中段：展示设备、产品、检测和车间实拍。\n结尾：支持微信联系、来图报价、快速接单。`
    };

    return responses[action] || "未生成内容";
  }

  function bindAiWorkbench() {
    const shell = document.querySelector("[data-ai-workbench]");
    if (!shell) return;

    const readPayload = () => ({
      enterprise: shell.querySelector('[name="enterprise"]')?.value.trim(),
      business: shell.querySelector('[name="business"]')?.value.trim(),
      products: shell.querySelector('[name="products"]')?.value.trim(),
      contact: shell.querySelector('[name="contact"]')?.value.trim(),
      customer: shell.querySelector('[name="customer"]')?.value.trim(),
      demand: shell.querySelector('[name="demand"]')?.value.trim(),
      budget: shell.querySelector('[name="budget"]')?.value.trim(),
      risk: shell.querySelector('[name="risk"]')?.value.trim()
    });

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

    const draft = readJSON(STORAGE_AI_DRAFT, {});
    Object.keys(draft).forEach((key) => {
      const output = shell.querySelector(`[data-ai-output="${key}"]`);
      if (output) output.textContent = draft[key];
    });
  }

  applyConfig();
  bindInquiryForms();
  bindWechatButtons();
  bindAdmin();
  bindAiWorkbench();
  renderInquiries();
})();
