const crypto = require("crypto");
const https = require("https");

const paymentOnline = async (request, response) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const orderInfo = "Thanh toán Black&Cat Store";
  const redirectUrl = "https://momo.vn/return";
  const ipnUrl = "https://callback.url/notify";
  const amount = request.body.tongTien;
  const requestType = "captureWallet";
  const extraData = ""; //pass empty value if your merchant does not have stores

  //before sign HMAC SHA256 with format
  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //signature
  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const req = https.request(options, (res) => {
    res.setEncoding("utf8");
    res.on("data", (body) => {
      console.log('body', body)
      response
        .status(200)
        .json({ data: {
          payUrl: JSON.parse(body).payUrl,
          qrCodeUrl: JSON.parse(body).qrCodeUrl
        }, message: "é é é" });
    });
    res.on("end", () => {
      console.log("No more data in response.");
    });
  });

  req.write(requestBody);
  req.end();
};

module.exports = { paymentOnline };
