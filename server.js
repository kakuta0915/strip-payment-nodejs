const express = require("express");
const app = express();
const PORT = 3000;

// シークレットキー
const stripe = require('stripe')('sk_test_51OwJ4iKhKNkDMmE5r76y79tcC6ZRlb3xiWVBK25mC67XaRieiskJaZb0gdpqOm2xSj7FzeTGlMTt1VJxZrLX9cAS00RE3jMvzE');

const YOUR_DOMAIN = "http://localhost:3000";

app.use(express.static("public"));

// フォームボタンを押すとPOSTメソッド実行
app.post("/create-checkout-session", async (req, res) => {
  try {
    // pricesにサブスクの情報が入っている
    const prices = await stripe.prices.list();

    // sessionを作成 (何を購入したのか、購入した量などの情報)
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: prices.data[0].id,
        quantity: 1,
      }],
      mode: "subscription",
      
      // どこに飛ぶかURLを指定
      success_url: `${YOUR_DOMAIN}/success.html?session_id{CHECKOUT_SESSION_ID}`,
      
      // キャンセルした時のURL
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    // 契約完了時のリダイレクト先指定
    res.redirect(303, session.url);

  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, console.log("サーバーが起動しました"));