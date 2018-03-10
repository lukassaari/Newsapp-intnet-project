from flask import Flask, render_template, Blueprint

'''
Routes the user to the different pages (called app in lab5)
'''

app = Flask(__name__)

# Login screen
@app.route("/")
def index():
    return render_template("Login.js")

# Start page display all news
@app.route("/news")
def news():
    return render_template("News.js")

'''
# Profile page
@app.route("/profile")
def profile():
    return render_template("profile")

# The page of a specific news article
@app.route("/news/<article>")
def show_article(article):
    return render_template("news " + article)
'''
