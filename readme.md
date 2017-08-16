# Slideshow.js

Slideshow libraries for HTML slide shows are a dime a dozen. A lot of them are probably way more mature than this one, but I don't like how they package the CSS with them and incorporate theming and whatever. So I just wrote a really simple JS library to make &lt;div>'s into slides that you navigate with the arrow keys. Styling is entirely separate (so make it look pretty or not, I don't care). Currently it uses jQuery because I was lazy, but I will eliminate that one day. I went ahead added [highlight.js](https://highlightjs.org/) and it's CSS file since I am usually presenting about software development, so this does serve as a bit of a template to "fork" when I start writing a new deck of slides. This project is under the Apache 2.0 License, so feel free to use it.

# Creating a slideshow using this repo.

It is possible to fork this repo and pull upstream changes as this library is improved. First, create a fork for your presentation as follows:

```
git clone https://github.com/emily-e/slideshow.js.git
mv slideshow.js my_presentation
cd my_presentation
git remote set-url origin https://github.com/myUserName/my_presentation
git remote add upstream https://github.com/emily-e/slideshow.js.git
git push origin master
git push --all
```

As you work on your presentation, to merge upstream improvements:

```
git pull upstream master
```

This might result in merge conflicts with the template `slides.html`, but otherwise, it should usually be a clean merge.
