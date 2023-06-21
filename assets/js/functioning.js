// --- Authentication Part ---
// Sign Up Form ID's -
const myForm = document.getElementById("main-form");
const googleSignUp = document.querySelectorAll("#google-signUpIn");
const githubSignUp = document.querySelectorAll("#github-signUpIn");
const facebookSignUp = document.querySelectorAll("#facebook-signUpIn");

// Sign In Form ID's -
const signInForm = document.getElementById("signIn-form");

// Sign Up Methods -
class signUpMethods {
  // Basic LogIn System
  builtInSignUp() {
    const userName = myForm["sign-up-full-name"].value;
    const email = myForm["sign-up-email"].value;
    const password = myForm["sign-up-password"].value;
    const repassword = myForm["sign-up-repassword"].value;
    const phoneNumber = myForm["sign-up-number"].value;

    // CheckStuff -
    if (password != repassword || password === "") {
      Swal.fire(
        "Re Entered password is not same as entered password or field empty"
      );
    } else if (phoneNumber.length != 10) {
      Swal.fire("Phone Number is not valid");
    } else {
      // Send API request to create user
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          phoneNumber,
        }),
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title:
                "Account Created Successfully. Please Log In To order Delicious Cuisine",
            });
          } else {
            throw new Error("Failed to create account");
          }
        })
        .catch((error) => Swal.fire("" + error));
    }
  }

  // Google SignUp Method -
  googleSignUpIn() {
    // Send API request for Google sign-in
    fetch("/google-signin")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.email);
        this.notifyUser();
        this.redirectToClientSide();
      })
      .catch((error) => Swal.fire("" + error));
  }

  // FaceBook SignUp Method -
  facebookSignUpIn() {
    // Send API request for Facebook sign-in
    fetch("/facebook-signin")
      .then((response) => response.json())
      .then((data) => {
        this.notifyUser();
        this.redirectToClientSide();
      })
      .catch((error) => Swal.fire("" + error));
  }

  // GitHub SignUp Method -
  githubSignUpIn() {
    // Send API request for GitHub sign-in
    fetch("/github-signin")
      .then((response) => response.json())
      .then((data) => {
        this.notifyUser();
        this.redirectToClientSide();
      })
      .catch((error) => Swal.fire("" + error));
  }

  static redirectToClientSide() {
    window.setTimeout(() => {
      window.location.replace("client-side.html");
    }, 500);
  }

  // Notify User
  notifyUser() {
    window.setTimeout(function () {
      Swal.fire({
        icon: "success",
        title: "Account Signed In Successfully",
      });
    }, 1250);
  }
}

class signInMethods {
  // Basic LogIn System
  builtInSignIn() {
    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;
    console.log(email, password);

    // Send API request for built-in sign-in
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to log in");
        }
      })
      .then((data) => {
        // Store user data in local storage
        localStorage.setItem("user", JSON.stringify(data));
        // localStorage.setItem("cart", JSON.stringify(cart));
        Swal.fire({
          icon: "success",
          title: "Logged In",
        });

        signUpMethods.redirectToClientSide();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "" + error,
        });
      });
  }
}

// When HTML & Other code is done -
document.addEventListener("DOMContentLoaded", () => {
  // Sign In Methods -
  const signIn = new signInMethods();

  // Main Sign In Form
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signIn.builtInSignIn();
    });
  }
});
// When HTML & Other code is done -
document.addEventListener("DOMContentLoaded", () => {
  // Sign Up Mehtods -
  const signUp = new signUpMethods();

  // Main Sign Up Form
  if (myForm) {
    myForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signUp.builtInSignUp();
    });
  }

  // Google Sign Up Form
  if (googleSignUp) {
    googleSignUp.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.googleSignUpIn();
      });
    });
  }

  // GitHub Sign Up Form
  if (githubSignUp) {
    githubSignUp.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.githubSignUpIn();
      });
    });
  }

  // Facebook Sign Up Form
  if (facebookSignUp) {
    facebookSignUp.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.facebookSignUpIn();
      });
    });
  }

  // Sign In Methods -
  const signIn = new signInMethods();
  if (signInForm) {
    // Main Sign In Form
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signIn.builtInSignIn();
    });
  }

  // LogOut User -
  const logout = document.querySelectorAll("#userlogout");
  if (logout) {
    logout.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          icon: "success",
          title: "Logged Out Successfully",
        });
        // Send API request to log out
        fetch("/logout").then(() => {
          window.location.replace("index.html");
        });
      });
    });
  }
});

// Makes User ID Through EmailID Provided By User
let userDataID = "";
function makeUserDataID(userEmailID) {
  // let userDataID = '';
  for (i = 0; userEmailID.length; i++) {
    if (userEmailID[i] != "@") {
      userDataID = userDataID + userEmailID[i];
    } else {
      break;
    }
  }
  return userDataID;
}
