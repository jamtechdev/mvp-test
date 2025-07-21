"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/_utils/auth";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Form as BootstrapForm,
  Image,
  Card,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Link from "next/link";
import DarkModeSwitcher from "@/_components/common/DarkModeSwitcher";
import useThemeScheme from "@/hooks/useThemeScheme";

export default function SignIn() {
  const scheme = useThemeScheme();
  const isDark = scheme === "dark";
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = (values, { setSubmitting }) => {
    const user = loginUser(values.email, values.password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("You have been logged in successfully!");
      router.push("/campaigns/analytics");
    } else {
      toast.error("Invalid Credentials");
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-main-content m-auto m-1230 px-0">
      <Container className="ps-xl-0">
        <Row className="align-items-center">
          <Col lg={7} className="d-none d-lg-block px-0">
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden h-100">
              <Image
                // src="/images/authpage.png"
                //  src="/images/authpage2.jpg"
                src="/images/authpage-2.jpg"
                className="rounded-3 sign-in-banner"
                alt="login"
                width={646}
                height={804}
              />
            </Card>
          </Col>

          <Col lg={5}>
            <div className="mw-480 ms-lg-auto">
              {/* Logo */}
              <div className="d-flex align-items-center gap-2 mb-4">
                {/* <div className="logo-container"> */}

                <Image
                  src={
                    isDark
                      ? "/images/dark-logo-version.jpg"
                      : "/images/new-logo.png"
                  }
                  className="rounded-3 for-light-logo bg-white"
                  alt="logo"
                  width={25}
                  height={25}
                />
                {/* </div> */}
                <span className="logotxt">Umbrella Performance</span>
              </div>

              {/* Heading */}
              <h3 className="fs-28 mb-2">
                Welcome back to Umbrella Performance!
              </h3>
              {/* <p className="fw-medium fs-16 mb-4">
                Sign In with social account or enter your details
              </p> */}

              {/* Formik Form */}
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <BootstrapForm noValidate onSubmit={handleSubmit}>
                    {/* <div className="row justify-content-center">
                      <div className="col-lg-4 col-sm-4">
                        <a
                          href="https://www.google.com/"
                          target="_blank"
                          className="btn btn-outline-secondary bg-transparent w-100 py-2 hover-bg mb-4"
                          style={{
                            borderColor: "#D6DAE1",
                          }}
                        >
                          <Image
                            src="/images/google.svg"
                            alt="google"
                            width={25}
                            height={25}
                          />
                        </a>
                      </div>

                      <div className="col-lg-4 col-sm-4">
                        <a
                          href="https://www.facebook.com/"
                          target="_blank"
                          className="btn btn-outline-secondary bg-transparent w-100 py-2 hover-bg mb-4"
                          style={{
                            borderColor: "#D6DAE1",
                          }}
                        >
                          <Image
                            src="/images/facebook2.svg"
                            alt="facebook2"
                            width={25}
                            height={25}
                          />
                        </a>
                      </div>

                      <div className="col-lg-4 col-sm-4">
                        <a
                          href="https://www.apple.com/"
                          target="_blank"
                          className="btn btn-outline-secondary bg-transparent w-100 py-2 hover-bg mb-4"
                          style={{
                            borderColor: "#D6DAE1",
                          }}
                        >
                          <Image
                            src="/images/apple.svg"
                            alt="apple"
                            width={25}
                            height={25}
                          />
                        </a>
                      </div>
                    </div> */}
                    {/* Email */}
                    <BootstrapForm.Group className="mb-4">
                      <label className="label text-secondary">
                        Email Address
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="example@umbrellaperformance.com"
                        className="form-control h-55"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    {/* Password */}
                    <BootstrapForm.Group className="mb-4">
                      <label className="label text-secondary">Password</label>
                      <Field
                        name="password"
                        type="password"
                        placeholder="Type password"
                        className="form-control h-55"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </BootstrapForm.Group>

                    {/* Forgot Password */}
                    <BootstrapForm.Group className="mb-4">
                      <Link
                        href="/"
                        className="fw-medium text-primary text-decoration-none"
                      >
                        Forgot Password?
                      </Link>
                    </BootstrapForm.Group>

                    {/* Submit Button */}
                    <BootstrapForm.Group className="mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary fw-medium py-2 px-3 w-100"
                        disabled={isSubmitting}
                      >
                        <div className="d-flex align-items-center justify-content-center py-1">
                          <span>
                            {isSubmitting ? "Logging in..." : "Sign In"}
                          </span>
                        </div>
                      </button>
                    </BootstrapForm.Group>

                    {/* Sign Up */}
                    <BootstrapForm.Group>
                      <p>
                        Don’t have an account?{" "}
                        <Link
                          href="/sign-up"
                          className="fw-medium text-primary text-decoration-none"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </BootstrapForm.Group>
                  </BootstrapForm>
                )}
              </Formik>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Dark Mode */}
      <DarkModeSwitcher />
    </div>
  );
}
