#include "Lighthouse.h"
#include <iostream>
#include <JavaScriptCore/JavaScript.h> // Ensure you include the necessary header
#include <Ultralight/Ultralight.h>
#include <Ultralight/platform/Platform.h>
#include <Ultralight/platform/Config.h>
#include <windows.h>
#include <string>

#define WINDOW_WIDTH  650
#define WINDOW_HEIGHT 300

ultralight::RefPtr<Window> m_CreateWindow(App* app) {
    auto monitor = app->main_monitor();
    int screen_width = monitor->width();
    int screen_height = monitor->height();

    int window_x = (screen_width - WINDOW_WIDTH) / 2;
    int window_y = (screen_height - WINDOW_HEIGHT) / 2;

    auto window = Window::Create(monitor, WINDOW_WIDTH, WINDOW_HEIGHT, false, kWindowFlags_Borderless);

    HWND hwnd01 = static_cast<HWND>(window->native_handle());
    SetWindowPos(hwnd01, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);

    window->MoveTo(window_x, window_y - 160);
    return window;
}

MyApp::MyApp() {
    ///
    /// Create our main App instance.
    ///
    app_ = App::Create();

    window_ = m_CreateWindow(app_.get());

    overlay_ = Overlay::Create(window_, 1, 1, 0, 0);
    
    OnResize(window_.get(), window_->width(), window_->height());

    overlay_->view()->LoadURL("file:///app.html");

    ///
    /// Register our MyApp instance as an AppListener so we can handle the
    /// App's OnUpdate event below.
    ///
    app_->set_listener(this);

    ///
    /// Register our MyApp instance as a WindowListener so we can handle the
    /// Window's OnResize event below.
    ///
    window_->set_listener(this);

    ///
    /// Register our MyApp instance as a LoadListener so we can handle the
    /// View's OnFinishLoading and OnDOMReady events below.
    ///
    overlay_->view()->set_load_listener(this);

    ///
    /// Register our MyApp instance as a ViewListener so we can handle the
    /// View's OnChangeCursor and OnChangeTitle events below.
    ///
    overlay_->view()->set_view_listener(this);
}

MyApp::~MyApp() {
}

void MyApp::Run() {
    app_->Run();
}

void MyApp::OnUpdate() {
    // detect keypresses
    if (GetAsyncKeyState(VK_ESCAPE)) {
        app_->Quit();
    }

    // if clicked off the window, close it
    if (GetAsyncKeyState(VK_LBUTTON)) {
        POINT p;
        GetCursorPos(&p);
        if (p.x < window_->x() || p.x > window_->x() + window_->width() || p.y < window_->y() || p.y > window_->y() + window_->height()) {
            window_->Close();
        }
    }

    // if pause brak is pressed, show the window
    if (GetAsyncKeyState(VK_PAUSE)) {
        window_ = m_CreateWindow(app_.get());
    }

    overlay_->view()->Focus();
    overlay_->Focus();


    // if (overlay_->view()->HasFocus()) {
    //     // overlay_->view()->set_load_listener(this);
    //     // overlay_->view()->set_view_listener(this);
    //     // overlay_->view()->Focus();
    //     overlay_->Focus();
    // }

}

JSValueRef OnButtonClick(JSContextRef ctx, JSObjectRef function,
    JSObjectRef thisObject, size_t argumentCount, 
    const JSValueRef arguments[], JSValueRef* exception) {

    if (argumentCount < 1) {
        // Handle the case where there are no arguments
        return JSValueMakeNull(ctx);
    }

    // Convert JSValueRef to JSStringRef
    JSStringRef jsString = JSValueToStringCopy(ctx, arguments[0], exception);
    if (jsString == nullptr) {
        // Handle conversion error
        return JSValueMakeNull(ctx);
    }

    // Convert JSStringRef to const char*
    size_t maxBufferSize = JSStringGetMaximumUTF8CStringSize(jsString);
    char* buffer = new char[maxBufferSize];
    JSStringGetUTF8CString(jsString, buffer, maxBufferSize);

    // Create the JavaScript string
    std::string scriptStr = "document.getElementById('result').innerText = '";
    scriptStr += buffer;
    scriptStr += "';";

    // Clean up
    delete[] buffer;
    JSStringRelease(jsString);

    // Create our string of JavaScript
    JSStringRef script = JSStringCreateWithUTF8CString(scriptStr.c_str());

    // Execute it with JSEvaluateScript, ignoring other parameters for now
    JSEvaluateScript(ctx, script, 0, 0, 0, 0);

    // Release our string (we only Release what we Create)
    JSStringRelease(script);

    return JSValueMakeNull(ctx);
    }

void MyApp::OnClose(ultralight::Window* window) {
//   app_->Quit();
}

void MyApp::OnResize(ultralight::Window* window, uint32_t width, uint32_t height) {
  ///
  /// This is called whenever the window changes size (values in pixels).
  ///
  /// We resize our overlay here to take up the entire window.
  ///
  overlay_->Resize(width, height);
}

void MyApp::OnFinishLoading(ultralight::View* caller,
                            uint64_t frame_id,
                            bool is_main_frame,
                            const String& url) {
  ///
  /// This is called when a frame finishes loading on the page.
  ///
}

void MyApp::OnDOMReady(ultralight::View* caller,
                       uint64_t frame_id,
                       bool is_main_frame,
                       const String& url) {
  ///
  /// This is called when a frame's DOM has finished loading on the page.
  ///
  /// This is the best time to setup any JavaScript bindings.
  ///

  auto scoped_context = caller->LockJSContext();
  
  // Typecast to the underlying JSContextRef.
  JSContextRef ctx = (*scoped_context);
  
  // Create a JavaScript String containing the name of our callback.
  JSStringRef name = JSStringCreateWithUTF8CString("OnButtonClick");

  // Create a garbage-collected JavaScript function that is bound to our
  // native C callback 'OnButtonClick()'.
  JSObjectRef func = JSObjectMakeFunctionWithCallback(ctx, name, 
                                                      OnButtonClick);
  
  // Get the global JavaScript object (aka 'window')
  JSObjectRef globalObj = JSContextGetGlobalObject(ctx);

  // Store our function in the page's global JavaScript object so that it
  // accessible from the page as 'OnButtonClick()'.
  JSObjectSetProperty(ctx, globalObj, name, func, 0, 0);

  // Release the JavaScript String we created earlier.
  JSStringRelease(name);
}

void MyApp::OnChangeCursor(ultralight::View* caller,
                            Cursor cursor) {
    ///
    /// This is called whenever the page requests to change the cursor.
    ///
    /// We update the main window's cursor here.
    ///
    window_->SetCursor(cursor);
}

void MyApp::OnChangeTitle(ultralight::View* caller,
                            const String& title) {
    ///
    /// This is called whenever the page requests to change the title.
    ///
    /// We update the main window's title here.
    ///
    window_->SetTitle(title.utf8().data());
}
