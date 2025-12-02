from flask import Flask, render_template, request

# Initialize the Flask application
# template_folder='.' means look for HTML files in the current directory
app = Flask(__name__, template_folder='.', static_folder='.')

@app.route('/')
def home():
    """
    This function handles the home page.
    It simply returns the index.html file.
    """
    return render_template('index.html')

@app.route('/search')
def search():
    """
    This function handles the search request.
    It gets the query from the URL (e.g., /search?q=hello)
    and returns a simple results page.
    """
    # Get the 'q' parameter from the URL
    query = request.args.get('q', '')
    
    # In a real app, you would search a database here.
    # For now, we'll just return a simple HTML string showing the query.
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{query} - Snapverse Search</title>
        <style>
            body {{ font-family: 'Poppins', sans-serif; padding: 40px; color: #1a1a2e; }}
            h1 {{ color: #7c3aed; }}
            .result {{ margin-bottom: 20px; padding: 15px; border: 1px solid #e0e7ff; border-radius: 8px; }}
            a {{ color: #7c3aed; text-decoration: none; }}
            a:hover {{ text-decoration: underline; }}
        </style>
    </head>
    <body>
        <h1>Search Results for: {query}</h1>
        <p>Found 3 results (0.42 seconds)</p>
        
        <div class="result">
            <h3><a href="#">Result 1 for {query}</a></h3>
            <p>This is a simulated search result for your query "{query}". In a real backend, this would come from a database.</p>
        </div>
        
        <div class="result">
            <h3><a href="#">Result 2 for {query}</a></h3>
            <p>Another interesting result related to "{query}". Snapverse helps you discover the universe.</p>
        </div>
        
        <div class="result">
            <h3><a href="#">Result 3 for {query}</a></h3>
            <p>The final result for "{query}". You can customize this backend logic in app.py.</p>
        </div>
        
        <br>
        <a href="/">&larr; Go Back to Home</a>
    </body>
    </html>
    """

if __name__ == '__main__':
    print("Snapverse Backend Running!")
    print("Open http://127.0.0.1:5000 in your browser")
    app.run(debug=True)
