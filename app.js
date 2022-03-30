const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('Public'))

const articleSchema = new Schema({
    title: String,
    content: String
})

const Articles = mongoose.model('article', articleSchema);


app.route('/articles').get((req, res) => {

    console.log('get Route is Working');
    Articles.find((err, foundArticle) => {
        console.log(foundArticle);

        if (err) {
            res.send(err)
        } else {
            res.send(foundArticle);
        }
    });
})

    .post((req, res) => {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Articles({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save((err) => {
            console.log(err)
        });
        res.redirect('/articles')
    })

    .delete((res, req) => {
        Articles.deleteOne((err) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send('Deleted Successfully');
                console.console.log("delete successfully");
            }
        })
    })


// req targeting a Specific Article



app.route('/articles/:post').get((req, res) => {
    Articles.findOne({ title: req.params.post }, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle)
        } else {
            res.send(err);
        }
    })
})
.put((req, res)=>{
        Articles.updateOne(
        { title: req.params.post },
         { $set:{title: req.body.title, content: req.body.content }},
          { overwrite: true },
           (err) => {
            if (!err) {
                res.send('Success')
            }
        }
    );
})
.patch((req,res)=>{
    Articles.updateOne({title:req.params.post},
        {$set: req.body},(err)=>{
            if (!err) {
                res.send('Successfully Updated the field')
            }else{
                res.send(err);
            }
        });
})
.delete((req, res)=>{
    Articles.deleteOne({title: req.params.post},(err)=>{
        console.log("Article Deleted")
        res.send('Article deleted successfully');
    })
})





app.listen(3000, () => {
    console.log('listening on port 3000')
})