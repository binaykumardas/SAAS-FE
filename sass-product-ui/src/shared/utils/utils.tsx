/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const Util = {

   getFormattedJson(json:any) {
    return this.isValidString(json) ? JSON.parse(json) : json;
  },

   getParseJson(str: any) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  },

  doDeepCopy(obj: any = {}) {
    return JSON.parse(JSON.stringify(obj));
  },

  isObject(value: any): boolean {
    return value !== null && 'object' === typeof value;
  },

  isDefined(value: any): boolean {
    return value && 'undefined' !== typeof value;
  },

  isValidArray(value: any): boolean {
    return this.isArray(value) && 0 < value.length;
  },

  isArray(value: any): boolean {
    return Array.isArray(value);
  },

  isObjectEmpty(objs: any): boolean {
    return Object.keys(objs).length === 0;
  },

  isValidObject(obj: any): boolean {
    return this.isObject(obj) && Object.keys(obj).length > 0;
  },

  isValidString(str: any): boolean {
    return 'string' === typeof str && 0 < str.length;
  },

  isUndefined(value: any) {
    return !value || 'undefined' === typeof value;
  },

  setDataToLocalStore(key: string, value: any): void {
      if(!this.isValidString(key)) {
        throw new Error('Invalid key!!!!');
      }

      let keyValue = key;
      let getValue = JSON.stringify(value);
      localStorage.setItem(keyValue, getValue);
  },

  getDataFromLocalStore(localKey: string): any {
    if(!this.isValidString(localKey)) {
      throw new Error('Invali local key!!!');
    }

    let localStoreValue: any = localStorage? localStorage.getItem(localKey):null;
    try {
        return JSON.parse(localStoreValue);
    } catch (e) {
        return localStoreValue;
    }
  },

  setDataToSessionStore(key: string, value: any): void {
      if(!this.isValidString(key)) {
        throw new Error('Invalid key!!!!');
      }

      let keyValue = key;
      let getValue = JSON.stringify(value);
      sessionStorage.setItem(keyValue, getValue)
  },

  getDataFromSessionStore(localKey: string): any {
    if(!this.isValidString(localKey)) {
      throw new Error('Invali local key!!!');
    }

    let sessionStoreValue: any = sessionStorage? sessionStorage.getItem(localKey):null;
    try {
        return JSON.parse(sessionStoreValue);
    } catch (e) {
        return sessionStoreValue;
    }
  },

  getStringLength(str: any) {
    return [...str].length;
  },

  getYears() {
    const currentYear = (new Date()).getFullYear();
    const range = (start:any, stop:any, step: any) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    return range(currentYear, currentYear - 50, -1)
  },

  getValidData(data:any) {
    return (!(this.isUndefined(data) || data === null || data === ""));
  },

  formatDate(date: any) {
    if(!this.getValidData(date)) return '';
    const parsedDate = new Date(date);
    const formatted = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(parsedDate).replace(/ /g, '-');

    return formatted;
  },

  formatHeight(height: any) {
    if (!this.getValidData(height)) return '';
    const feet = Math.floor(height);
    const inches = Math.round((height - feet) * 12);
    return `${feet}ft ${inches}inch`;
  },

  setTokens(access:string, refresh:string) {
    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("refreshToken", refresh);
  },

  getAccessToken(){
    return sessionStorage.getItem("accessToken");
  },

  getRefreshToken(){
    return sessionStorage.getItem("refreshToken");
  },

  clearTokens() {
    sessionStorage.clear();
  },

  isAuthenticated: () => !!sessionStorage.getItem("accessToken"),

};

export default Util;