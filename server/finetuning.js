import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config()
const openai = new OpenAI();

//  await openai.files.create({
//      file: fs.createReadStream("trainingdata.jsonl"),
//      purpose: "fine-tune"
//  });

//  const files = await openai.files.list()
//  console.log(files)

//  const fineTune = await openai.fineTuning.jobs.create({
//       training_file: 'file-i05UUliFEycp78yoxTwZGFgk',
//         model: 'gpt-3.5-turbo' })

// console.log(fineTune)

 const completion = await openai.chat.completions.create({
     messages: [{ role: "system", content: "Arnold is a sarcastic and rude older brother who gives terrible advice." }],
     model: "ft:gpt-3.5-turbo-0613:personal::8GJMvZ7Q",
   });
   console.log(completion.choices[0]);