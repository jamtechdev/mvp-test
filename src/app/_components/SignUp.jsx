"use client";

import { useRouter } from "next/navigation";
import { registerUser } from "@/_utils/auth";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Form as BootstrapForm,
  Image,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Link from "next/link";
import DarkModeSwitcher from "@/_components/common/DarkModeSwitcher";
import useThemeScheme from "@/hooks/useThemeScheme";

export default function SignUp() {
  const scheme = useThemeScheme();
  const isDark = scheme === "dark";
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleRegister = (values, { setSubmitting }) => {
    const user = registerUser(values.email, values.password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Account has been created successfully!");
      router.push("/campaigns/analytics");
    } else {
      toast.error("Something went wrong!");
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-main-content m-auto m-1230 px-0">
      <Container className="ps-xl-0">
        <Row className="align-items-center full-screen-height">
          <Col lg={7} className="d-none d-lg-block px-0">
            <Image
              // src="/images/authpage.png"
              src="/images/authpage-2.jpg"
              className="rounded-3 sign-in-banner"
              alt="signup"
              width={646}
              height={804}
            />
          </Col>

          <Col lg={5}>
            <div className="mw-480 ms-lg-auto">
              {/* Logo */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <Image
                  src={
                    isDark
                      ? "/images/white-logo.png"
                      : "/images/new-logo.png"
                  }
                  className="rounded-3 for-light-logo"
                  alt="logo"
                  width={25}
                  height={25}
                />
                <span className="logotxt">Umbrella Performance</span>
              </div>

              {/* Heading */}
              <h3 className="fs-28 mb-2">Create your account</h3>
              {/* <p className="fw-medium fs-16 mb-4">
                Register with social account or enter your details
              </p> */}

              {/* Formik Form */}
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <BootstrapForm noValidate onSubmit={handleSubmit}>
                    {/* Social Buttons */}
                    {/* <div className="row justify-content-center">
                      <div className="col-lg-4 col-sm-4">
                        <a
                          href="https://www.google.com/"
                          target="_blank"
                          className="btn btn-outline-secondary bg-transparent w-100 py-2 hover-bg mb-4"
                          style={{ borderColor: "#D6DAE1" }}
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
                          style={{ borderColor: "#D6DAE1" }}
                        >
                          <Image
                            src="/images/facebook2.svg"
                            alt="facebook"
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
                          style={{ borderColor: "#D6DAE1" }}
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

                    {/* Submit */}
                    <BootstrapForm.Group className="mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary fw-medium py-2 px-3 w-100"
                        disabled={isSubmitting}
                      >
                        <div className="d-flex align-items-center justify-content-center py-1">
                          <span>
                            {isSubmitting ? "Registering..." : "Sign Up"}
                          </span>
                        </div>
                      </button>
                    </BootstrapForm.Group>

                    {/* Already have an account */}
                    <BootstrapForm.Group>
                      <p>
                        Already have an account?{" "}
                        <Link
                          href="/sign-in"
                          className="fw-medium text-primary text-decoration-none"
                        >
                          Sign In
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

      <DarkModeSwitcher />
    </div>
  );
}
