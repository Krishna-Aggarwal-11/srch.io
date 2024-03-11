# webclient

- A RAG based client for web surfing!
- Built with the help of LeptonAI, Python and JavaScript!

## Steps to install :
- First install the node modules
 ```Python
    # Go into the directory you want to install
    mkdir client
    git clone https://github.com/nerdlab53/serch.io.git
    cd serch.io
    !pip install -r requirements.txt
    cd serch.io/webclient/frontend
    npm install # to install the node packages
    npm run dev # to run the web page
 ```
- Now let us set up the backend for searching and returning the results to the Mixtral 8x7B on LeptonAI platform
 ```Python
    $ export SEARCHAPI_API_KEY=YOUR_API_KEY
    # specify the backend and run the python file
    $ BACKEND=SEARCHAPI python search_backend.py    
 ```
