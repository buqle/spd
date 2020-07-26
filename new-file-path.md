/src/routes/Purchase/statisticAnalysis/statisticsTraceability/index.js             患者退货列表
/src/routes/Purchase/statisticAnalysis/statisticsTraceability/detailsList.js      患者退货          退货单列表
/src/routes/Purchase/statisticAnalysis/statisticsTraceability/details.js           患者退货          退货单详情列表
/src/routes/Purchase/statisticAnalysis/personWorkStatistics/dispensing.js                  调济列表
/src/routes/Purchase/statisticAnalysis/personWorkStatistics/drugRechecking.js          发药复核列表
/src/routes/Purchase/statisticAnalysis/personWorkStatistics/inventory.js		盘点列表


/src/routes/purchase/statisticAnalysis/personWorkStatistics/tracing.js 		人员操作追溯
/src/routes/purchase/statisticAnalysis/personWorkStatistics/details.js 		人员单据追溯明细 - 详情
/src/routes/purchase/statisticAnalysis/personWorkStatistics/tracingCheck.js   人员验收单
/src/routes/purchase/statisticAnalysis/personWorkStatistics/detailsCheck.js  	人员验收单 - 详情
/src/routes/purchase/statisticAnalysis/personWorkStatistics/tracingTotalList.js  补货单明细
/src/routes/purchase/statisticAnalysis/personWorkStatistics/acceptanceTotalList.js  验收单明细

/src/routes/purchase/statisticAnalysis/personWorkStatistics/lowerShelf.js   下架
/src/routes/purchase/statisticAnalysis/personWorkStatistics/outgoingReview.js  出库复核
/src/routes/purchase/statisticAnalysis/personWorkStatistics/inventory.js  盘点
/src/routes/purchase/statisticAnalysis/personWorkStatistics/dispensing.js  调剂
/src/routes/purchase/statisticAnalysis/personWorkStatistics/drugRechecking.js  发药复核



/src/models/purchase/patientTracing.js        请求接口方法文件


/src/services/purchase/patientTracing.js        接口文件

/src/api/purchase/patientTracing.js //api


nav


/*19-1-18*/
    {
      name: "患者追溯",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/patientTracing',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/patientTracing')),
    },
    //查询统计 - 批号追溯 - 详情
    {
      name: "患者追溯 - 详情",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/patientTracing/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
      component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/patientTracing/details')),
    },{
      name: "同比环比统计",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/statisticsTraceability',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability')),
    },
    {
      name: "人员工作统计及追溯",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/statisticsTraceability/detailsList/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
      component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability/detailsList')),
    }, 
    {
      name: "人员单据追溯明细",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/statisticsTraceability/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
      component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/statisticsTraceability/details')),
    },
    /*人员工作统计	*/
    {
      name: "人员工作统计",
      icon: 'setting',
      path: '/purchase/statisticAnalysis/personWorkStatistics/',
      component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics')),
    },
      /*人员工作统计	*/
      {
          name: "人员操作追溯",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracing/:guid',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracing')),
      },
      //人员单据追溯明细 - 详情
      {
          name: "人员单据追溯明细 - 详情",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/details/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/details')),
      },
      {
          name: "人员验收单",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracingCheck/:guid',
          component: dynamicWrapper(app, [], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracingCheck')),
      },
      //人员单据追溯明细 - 详情
      {
          name: "人员验收单 - 详情",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/detailsCheck/:bigDrugCode/:drugCode/:hisDrugCode/:lot',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/detailsCheck')),
      },
      //补货明细
      {
          name: "补货单明细",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/tracingTotalList/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/tracingTotalList')),
      },
      //验收单明细
      {
          name: "验收单明细",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/acceptanceTotalList/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/acceptanceTotalList')),
      },
      //下架
      {
          name: "下架",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/lowerShelf/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/lowerShelf')),
      },
      //出库复核
      {
          name: "出库复核",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/outgoingReview/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/outgoingReview')),
      },
      //盘点
      {
          name: "盘点",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/inventory/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/inventory')),
      },
      //调剂
      {
          name: "调剂",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/dispensing/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/dispensing')),
      },
      //发药复核
      {
          name: "发药复核",
          icon: 'setting',
          path: '/purchase/statisticAnalysis/personWorkStatistics/drugRechecking/:bigDrugCode',
          component: dynamicWrapper(app, ['purchase/patientTracing'], () => import('../routes/Purchase/statisticAnalysis/personWorkStatistics/drugRechecking')),
      },


