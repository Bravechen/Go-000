/**
 * @description home page
 * @author Brave Chan
 */
//============================================================
(function (window, undefined) {
  'use strict';
  //============================================================
  class EditorItem {
    constructor(id, el) {
      this.id = id;
      this.el = el;
      this.stuName = '';
      this.stuScore = 0;
      this.stuRanking = '';
      this.init();
    }

    init() {
      this.createChildren();
      this.childrenCreated();
    }

    createChildren() {

    }

    childrenCreated() {

    }

    getValue() {
      return {};
    }

  }
  //============================================================
  function preset() {
    let data = this.data;
    this.data = null;
    let obj = Object.keys(data).reduce(function(prev, item) {
      if (typeof data[item] === 'function') {
        return prev;
      }
      prev[item] = data[item];
      return this;
    }, {});

    Object.assign(this, obj);

    let fns = Object.keys(this.methods);
    let len = fns.length;
    let methods = this.methods;
    this.methods = null;
    while(len--) {
      let fn = methods[fns[len]];
      if (typeof fn === 'function') {
        this[fns[len]] = fn;
      }
    }
  }

  function createChildren() {
    let querys = this.querys;
    let keys = Object.keys(querys);

    this.els = keys.reduce(function(prev, item) {
      let el = document.querySelector(querys[item]);
      if (!el) {
        return prev;
      }
      prev[item] = el;
      return prev;
    }, {});
  }

  function addUIEvents() {
    let keys = Object.keys(this.uiEvents);
    let len = keys.length;
    while(len--) {
      let elKey = keys[len];
      let el = this.els[elKey];
      if (!el) {
        continue;
      }

      let events = Object.keys(this.uiEvents[elKey]);
      let len2 = events.length;
      while(len2--) {
        let fn = this.uiEvents[elKey][events[len2]];
        if (typeof fn === 'function') {
          el.addEventListener(events[len2], fn.bind(this));
          continue;
        }

        if (typeof fn === 'string') {
          this[fn] = this[fn].bind(this);
          el.addEventListener(events[len2], this[fn]);
        }
      }
    }
  }

  function createItemDOM() {
    return `
    <div class="item editor-line">
      <div class="wrapper">
        <div class="stu_name"><span data-type="editor-item">学生姓名</span></div>
        <div class="stu_score"><span data-type="editor-item">0</span></div>
        <div class="stu_ranking"><span data-type="editor-item">-</span></div>
      </div>
      <div class="operate">
        <a href="javascript:void 0" data-type="deleteLine">删除</a>
      </div>
    </div>
    `;
  }


  //============================================================
  function init(vm) {
    init.onInit = onInit.bind(vm);
    window.addEventListener('DOMContentLoaded', init.onInit);
  }

  function onInit() {
    window.removeEventListener('DOMContentLoaded', init.onInit);
    init.onInit = null;

    return [preset, createChildren, addUIEvents].reduce(function (prev, item) {
      if (typeof item !== 'function') {
        return prev;
      }
      item.call(prev);
      return prev;
    }, this);
  }
  //============================================================
  init({
    data: {
      currentOpenEl: null,
    },
    querys: {
      el: '.home-page',
      stuList: '.home-page>.stu-list',
      ctrlBox: '.home-page>.ctrl-box',
      submitBox: '.home-page>.submit-box'
    },
    uiEvents: {
      stuList: {
        click: 'onStuItemClick'
      },
      ctrlBox: {
        click: 'onCtrlBoxClick'
      },
      submitBox: {
        click: 'onSubmitBoxClick'
      }
    },
    methods: {
      onStuItemClick(e) {
        let target = e.target, data, type;
        if (!target || !(data = target.dataset) || !(type = data.type)) {
          return;
        }
        let fn = this[type];
        if (typeof fn === 'function') {
          fn.apply(this, [target, data]);
        }
      },
      onCtrlBoxClick(e) {
        let target = e.target, data, type;
        if (!target || !(data = target.dataset) || !(type = data.type)) {
          return;
        }
        let fn = this[type];
        if (typeof fn === 'function') {
          fn.apply(this, [target, data]);
        }
      },
      onSubmitBoxClick(e) {
        let target = e.target, data, type;
        if (!target || !(data = target.dataset) || !(type = data.type)) {
          return;
        }
        let fn = this[type];
        if (typeof fn === 'function') {
          fn.apply(this, [target, data]);
        }
      },
      deleteLine(el, data) {
        console.log('delete line', data);
      },
      addLine(el, data) {
        console.log('add line', data);
        var div = document.createElement('div');
        div.innerHTML = createItemDOM();
        var el = div.querySelector('.item');
        this.els.stuList.appendChild(el);
        div = null;
      },
      confirmSubmit(el, data) {
        console.log('confirm submit', data);
      },
      toggleEditor(el, data) {
        let opening = !!+el.getAttribute('data-open');
        if (!opening) {
          if (this.currentOpenEl) {
            this.closeEditor(this.currentOpenEl);
            this.currentOpenEl = null;
          }
          el.setAttribute('contenteditable', true);
          this.currentOpenEl = el;
          el.focus();
        }

        if (opening) {
          el.removeAttribute('contenteditable');
          this.currentOpenEl = null;
        }

        el.setAttribute('data-open', +!opening);
      },
      closeEditor(el) {
        el.setAttribute('data-open', 0);
        el.removeAttribute('contenteditable');
      }
    }
  });

})(window);
