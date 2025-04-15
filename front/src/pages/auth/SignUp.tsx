import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  userSignUpService,
  userDupCheckService,
  sendOtpService,
  verifyOtpService,
} from "../../services/userService";
import { isValidPassword, isValidName } from "../../utils/validators";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({ message, type }) => (
  <div
    className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${type === "success" ? "bg-blue" : "bg-orange"} transition-opacity duration-300`}
  >
    {message}
  </div>
);

const SignUpPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthdate: "",
  });
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    if (formData.password.length > 0) {
      if (!isValidPassword(formData.password)) {
        setPasswordError(
          "비밀번호는 최소 8자, 하나 이상의 특수문자, 숫자, 대문자가 포함되어야 합니다."
        );
      } else {
        setPasswordError(null);
      }
    }
  }, [formData.password]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      if (!isValidPassword(e.target.value)) {
        setPasswordError(
          "비밀번호는 최소 8자, 하나 이상의 특수문자, 숫자, 대문자가 포함되어야 합니다."
        );
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleEmailCheck = async () => {
    try {
      const result = await userDupCheckService({
        targetString: formData.email,
        action: 1,
      });
      if (result) {
        setIsEmailChecked(true);
        showToast("사용 가능한 이메일입니다.", "success");
      } else {
        showToast("이미 사용 중인 이메일입니다.", "error");
      }
    } catch (error) {
      showToast("이메일 확인 중 오류가 발생했습니다.", "error");
    }
  };

  const handleSendOtp = async () => {
    try {
      const result = await sendOtpService({ userEmail: formData.email });
      if (result) {
        showToast("인증번호가 발송되었습니다. 이메일을 확인하세요.", "success");
      } else {
        showToast("인증번호 발송에 실패했습니다.", "error");
      }
    } catch (error) {
      showToast("OTP 발송 중 오류가 발생했습니다.", "error");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const result = await verifyOtpService({
        userEmail: formData.email,
        certNumber: formData.otp,
      });
      if (result) {
        setIsOtpVerified(true);
        showToast("이메일 인증에 성공했습니다.", "success");
      } else {
        showToast("인증번호가 올바르지 않습니다.", "error");
      }
    } catch (error) {
      showToast("OTP 인증 중 오류가 발생했습니다.", "error");
    }
  };

  const handleLoginIdCheck = async () => {
    try {
      const result = await userDupCheckService({
        targetString: formData.loginId,
        action: 0,
      });
      if (result) {
        setIsLoginIdChecked(true);
        showToast("사용 가능한 아이디입니다.", "success");
      } else {
        showToast("이미 사용 중인 아이디입니다.", "error");
      }
    } catch (error) {
      showToast("아이디 확인 중 오류가 발생했습니다.", "error");
    }
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      showToast("비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    if (passwordError) {
      showToast(passwordError, "error");
      return;
    }

    if (!isValidName(formData.name)) {
      showToast("이름은 한글 또는 영문만 입력할 수 있습니다.", "error");
      return;
    }
    try {
      const result = await userSignUpService({
        userLoginId: formData.loginId,
        userPassword: formData.password,
        userName: formData.name,
        userEmail: formData.email,
        userBirth: formData.birthdate,
      });
      if (result) {
        showToast("회원가입이 완료되었습니다.", "success");
        setTimeout(() => navigate("/"), 2000); // 3초 후 '/' 경로로 이동
      } else {
        showToast("회원가입에 실패했습니다. 다시 시도해 주세요.", "error");
      }
    } catch (error) {
      showToast("회원가입 중 오류가 발생했습니다.", "error");
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return isEmailChecked && isOtpVerified;
      case 2:
        return (
          isLoginIdChecked &&
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword &&
          !passwordError
        );
      case 3:
        return formData.name && formData.birthdate;
      default:
        return false;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-snow">
      <div className="w-full max-w-md p-6 bg-snow rounded-lg">
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {step === 1 && "이메일 인증"}
          {step === 2 && "계정 생성"}
          {step === 3 && "개인 정보 입력"}
        </h2>
        <form className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일
                </label>
                <div className="flex space-x-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isEmailChecked}
                  />
                  <button
                    type="button"
                    onClick={handleEmailCheck}
                    disabled={isEmailChecked || !formData.email}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    중복 확인
                  </button>
                </div>
              </div>
              {isEmailChecked && (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    인증번호
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="인증번호를 입력하세요"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={isOtpVerified}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isOtpVerified}
                      className="px-4 py-2  bg-blue text-white rounded-md hover:bg-blue-hover focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      인증번호 발송
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleOtpVerification}
                    disabled={isOtpVerified || !formData.otp}
                    className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    인증번호 확인
                  </button>
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  아이디
                </label>
                <div className="flex space-x-2">
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="아이디를 입력하세요"
                    value={formData.loginId}
                    onChange={handleChange}
                    disabled={isLoginIdChecked}
                  />
                  <button
                    type="button"
                    onClick={handleLoginIdCheck}
                    disabled={isLoginIdChecked || !formData.loginId}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    중복 확인
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                />
                {passwordError && (
                  <p className="mt-1 text-red-500 text-sm">{passwordError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  생년월일
                </label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                이전
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignUp}
                disabled={!isStepValid()}
                className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-hover focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                회원가입
              </button>
            )}
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default SignUpPage;
