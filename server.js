require("./utils/db");
const User = require("./model/user");

async function cetakData() {
  const data = await User.findOne();
  console.log(data);
}
// async (email) => await User.findOne({ email: email });

// async function cetakEmail(email) {
//   const dataAnggota = await cetakData();
//   return dataAnggota.findOne({ email: email });
// }
// (email) => )

cetakData();
