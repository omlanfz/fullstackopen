const mongoose = require("mongoose");

const args = process.argv;

if (args.length < 3) {
  console.log("Usage: node mongo.js <password> [name] [number]");
  process.exit(1);
}

const dbPassword = args[2];
const contactName = args[3];
const contactNumber = args[4];

const connectionUrl = `mongodb+srv://excel:${dbPassword}@cluster0.mv6jzzi.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(connectionUrl);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Person", contactSchema);

if (contactName && contactNumber) {
  const entry = new Contact({ name: contactName, number: contactNumber });

  entry
    .save()
    .then(() => {
      console.log(`added ${contactName} number ${contactNumber} to phonebook`);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error saving the person: ", err);
      mongoose.connection.close();
    });
} else {
  Contact.find({})
    .then((entries) => {
      console.log("phonebook:");
      entries.forEach((entry) => {
        console.log(`${entry.name} ${entry.number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error fetching the person data: ", err);
      mongoose.connection.close();
    });
}
