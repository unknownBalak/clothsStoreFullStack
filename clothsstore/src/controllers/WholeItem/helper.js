import axios from "axios";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
export async function displayRazorPay(e) {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    console.log("This is res", res);
    let url = "http://localhost:3001/orders";
    const result = await axios.post(url);
    if (!result) {
      alert("server error");
      return;
    }
    console.log("This isres", result);
    const { amount, id, currency } = result.data;

    const options = {
      key: "",
      amount: amount.toString(),
      currency,
      name: "Ram corp.",
      description: "Test Transaction",
      image: {},
      order_id: id,
      handler: async function (response) {
        // const data = {
        //   orderCreationId: id,
        //   razorpayPaymentId: response.razorpay_payment_id,
        //   razorpayOrderId: response.razorpay_order_id,
        //   razorpaySignature: response.razorpay_signature,
        // };
        console.log(response.razorpay_payment_id);
        console.log(response.razorpay_order_id);
        console.log(response.razorpay_signature);
        // const result = await axios.post(
        //   "http://localhost:3001/payment/success",
        //   data
        // );

        // alert(result.data.msg);
      },

      prefill: {
        name: "Shashi ",
        email: "dfererey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Shashi Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };
    const paymentObject = new window.Razorpay(options);

    paymentObject.on("payment.failed", function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });

    paymentObject.open();
  } catch (error) {
    alert(`${error}, please try after sometime!`);
  }
}
