# serch.io webclient
<p align="center" width="100%">
    <img width="33%" src="assets/logo.png">
</p>
- A RAG based client for web surfing!
- Built with the help of LeptonAI, Python and JavaScript!

## Steps to install :
- Install the node modules
 ```Python
    # Go into the directory you want to install
    mkdir <YOUR_DIRECTORY>
    git clone https://github.com/nerdlab53/serch.io.git
    cd serch.io
    !pip install -r requirements.txt
    cd serch.io/webclient/frontend
    npm install # to install the node packages
    npm run dev # to run the web page
 ```
- Enable the backend using the LeptonAI engine
 ```Python
    $ export SEARCHAPI_API_KEY=YOUR_API_KEY
    # specify the backend and run the python file
    $ BACKEND=SEARCHAPI python search_backend.py    
 ```
