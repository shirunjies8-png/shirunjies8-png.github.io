(function () {
  const STORAGE_CONFIG = "liqiAiAdminData";
  const STORAGE_INQUIRIES = "liqiAiInquiries";

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

  applyConfig();
  bindInquiryForms();
  bindWechatButtons();
  bindAdmin();
  renderInquiries();
})();
