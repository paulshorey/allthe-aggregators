export default () => (
  <div id="header">
    <img id="headerLogo" src="/static/images/logo/Beyond_Limits_Logo_WHITE_RGB_1x_170x10.png" />

    <div id="headerInfo">
      {/*% if username %*/}
      <a href="javascript:/*auth.logoutUser();*/">logout "admin" &raquo;</a>
      {/*% else %}
        <div id="login-popup-overlay">
          <div id="login-popup">
            <form id="login-popup-form">
              <h3>
                <span>Login</span>
                <label><a href="">or create an account</a></label>
              </h3>
              <div class="inputs">
                <input class="bl" name="username" type="text" style="color: #6d7fcc" placeholder="username" onclick="document.getElementById('loginButton').scrollIntoView({behavior: 'smooth'});">
                <input class="bl" name="password" type="password" style="color: #6d7fcc" placeholder="password">
              </div>
              <div class="buttons">
                <button type="submit" class="bl">Login</button>
              </div>
            </form>
            <script>
              document.getElementById("login-popup-form").onsubmit = function(event){
                event.preventDefault();
                var form = event.target;
                auth.loginUser({username:form.username.value,password:form.password.value});
                return false;
              };
            </script>
          </div>
        </div>
      {% endif %*/}
    </div>
  </div>
);
