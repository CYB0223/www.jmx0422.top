
import md5 from 'js-md5'
import crypto from "crypto-js";

const decrypt = async function(ciphertext, iv, t) {
    try {
        const key = await generateKey(t);
        const decrypted = crypto.AES.decrypt(ciphertext, crypto.enc.Utf8.parse(key), {
            iv: crypto.enc.Hex.parse(iv),
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        });
        var dec = crypto.enc.Utf8.stringify(decrypted).toString();
        console.log(dec)
        return dec;
    } catch (error) {
        console.error("Decryption failed", error);
        throw error;
    }
};


function h(charArray, modifier) {
    const uniqueChars = Array.from(new Set(charArray));
    const numericModifier = Number(modifier.toString().slice(7));
    const transformedString = uniqueChars.map(char => {
      const charCode = char.charCodeAt(0);
      let newCharCode = Math.abs(charCode - (numericModifier % 127) - 1);
      if (newCharCode < 33) {
        newCharCode += 33;
      }
      return String.fromCharCode(newCharCode);
    }).join("");
    
    return transformedString;
  }

function getParams() {
    return {
        'akv': '2.8.1496',  // apk_version_name 版本号 
        'apv': '1.3.6', // 内部版本号
        'b': 'XiaoMi', // 手机品牌
        'd': 'e87a4d5f4f28d7a17d73c524eaa8ac37', // 设备id 可随机生成
        'm': '23046RP50C', // 手机型号
        'mac': '',  // mac地址 
        'n': '23046RP50C',  // 手机型号
        't': '1724050329',  // 时间戳
        'wifiMac': '020000000000',  // wifiMac地址
    };
}

const generateKey = async function(t) {
    const params = await getParams();
    const sortedKeys = Object.keys(params).sort();
    let concatenatedParams = "";

    sortedKeys.forEach(key => {
        if (key !== "t") {
            concatenatedParams += params[key];
        }
    });

    const keyArray = concatenatedParams.split("");
    const hashedKey = h(keyArray, t);
    console.log(md5(hashedKey))
    return md5(hashedKey);
};


const ciphertext = ''
const iv = ""
const timestamp = "1724050329" // 时间戳 一般情况下与 getParams() 中的 t 一致
decrypt(ciphertext, iv, timestamp)


 // getParams() 中的参数 以及一个固定参数 `token`： `6733b42e28cdba32` 都需要携带在 下面接口中的 Header 里
 // `token` 参数似乎不影响获取

 // http://api.extscreen.com/aliyundrive/qrcode

 // http://api.extscreen.com/aliyundrive/v3/token
 // 包括请求体内是 code= 的情况 和请求体内是 refresh_token= 的情况