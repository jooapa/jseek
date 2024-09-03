"""compile the thing"""
import os, sys, shutil

c_build = False
run_electron = False
build = False


if __name__ == "__main__":
    # get the args
    args = sys.argv[1:]
    
    # check if the args are empty
    if not args:
        print(  '''
                Usage: python compile.py [options]
                
                options:
                    -c: gcc compile
                    -js: run electron app
                    -build: build the electron app
            ''')
        sys.exit(1)
        
    # check if the args are valid
    for arg in args:
        if arg == '-cpp':
            c_build = True
        if arg == '-js':
            run_electron = True
        if arg == '-build':
            build = True
    
    if c_build:
        # change dir
        os.chdir("backend")
        if not os.path.exists("build"):
            os.makedirs("build")
        if not os.path.exists("build/Everything64.dll"):
            shutil.copy("libs/Everything64.dll", "build/Everything64.dll")
        
        result = os.system("""
            g++ -Iinclude -Llibs jseek.cpp -lEverything64 -o jseek
            """)
        
        if result != 0:
            print("Compilation failed")
            sys.exit(1)
        
        # move the binary to the root
        if os.name == 'nt':
            if os.path.exists("build/jseek.exe"):
                os.remove("build/jseek.exe")
            shutil.move("jseek.exe", "build/jseek.exe")
        else:
            if os.path.exists("build/jseek"):
                os.remove("build/jseek")
            shutil.move("jseek", "build/jseek")

    # check if the electron app is needed
    if run_electron:
        os.system("npm run pray")
            
    if build:
        os.system("npm run build")

        # Copy backend/build directory
        backend_build_src = "backend/build"
        backend_build_dst = "dist/win-unpacked/resources/build"
        if os.path.exists(backend_build_dst):
            shutil.rmtree(backend_build_dst)
        shutil.copytree(backend_build_src, backend_build_dst)

        # Copy src/app directory
        src_app_src = "src/app"
        src_app_dst = "dist/win-unpacked/resources/app"
        if os.path.exists(src_app_dst):
            shutil.rmtree(src_app_dst)
        shutil.copytree(src_app_src, src_app_dst)
    