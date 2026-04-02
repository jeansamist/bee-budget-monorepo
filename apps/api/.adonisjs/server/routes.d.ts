import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.delete_account': { paramsTuple?: []; params?: {} }
    'auth.profile': { paramsTuple?: []; params?: {} }
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.store': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'income_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.store': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'auth.profile': { paramsTuple?: []; params?: {} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'auth.profile': { paramsTuple?: []; params?: {} }
    'income_categories.index': { paramsTuple?: []; params?: {} }
    'income_categories.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.index': { paramsTuple?: []; params?: {} }
    'incomes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.delete_account': { paramsTuple?: []; params?: {} }
    'income_categories.store': { paramsTuple?: []; params?: {} }
    'incomes.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'auth.update_profile': { paramsTuple?: []; params?: {} }
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'income_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'income_categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'incomes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}