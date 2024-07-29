import os, sys

go_build = False
run_electron = False

if __name__ == "__main__":
    # get the args
    args = sys.argv[1:]
    
    # check if the args are empty
    if not args:
        print(  '''
                Usage: python run.py [options]
                
                options:
                    -go: build new go build
                    -js: run electron app
            ''')
        sys.exit(1)
        
    # check if the args are valid
    for arg in args:
        if arg == '-go':
            go_build = True
        if arg == '-js':
            run_electron = True
    
    # check if the go build is needed
    if go_build:
        # change dir
        os.chdir("backend")
        os.system("go build .")
        os.chdir("..")
    
    # check if the electron app is needed
    if run_electron:
        os.system("npm run pray")
            
    
    