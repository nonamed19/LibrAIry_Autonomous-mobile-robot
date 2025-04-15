import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StepIndicator from "../../components/ui/step-indicator";
import {
  fetchBookInfoFront,
  borrowBookService,
} from "../../services/bookService";
import { fetchUserInfoService } from "../../services/userService";
import BookCardVertical from "../../components/common/BookCardVertical";
import { fillBookDetailsKakao2 } from "../../utils/fillBookDetailsNaver";
import { mapToBookCardVertical } from "../../utils/transformers";
import { BookBorrowRequestDto } from "../../backapi/data-contracts";
import { isBookCardVertical } from "../../utils/validators";
import { motion, AnimatePresence } from "framer-motion";
import { Book, User, CheckCircle, AlertCircle } from "lucide-react";

const calculateReturnDate = () => {
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);
  return returnDate.toISOString().split("T")[0];
};

interface ProcessState {
  currentStep: number;
  bookInfo: BookCardVertical | null;
  userInfo: any;
  borrowResult: {
    message: string;
    status: string;
    returnDate?: string;
  } | null;
}

const initialProcessState: ProcessState = {
  currentStep: 0,
  bookInfo: null,
  userInfo: null,
  borrowResult: null,
};

async function pollData<T>(
  fetchFunction: () => Promise<T | null>,
  onSuccess: (data: T) => void,
  onTimeout: () => void,
  timeout: number = 10000,
  interval: number = 500
): Promise<void> {
  let elapsedTime = 0;
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(async () => {
      elapsedTime += interval;
      try {
        const data = await fetchFunction();
        if (data) {
          clearInterval(intervalId);
          onSuccess(data);
          resolve();
        }
      } catch (error) {
        console.error("데이터 요청 중 오류 발생:", error);
      }
      if (elapsedTime >= timeout) {
        clearInterval(intervalId);
        onTimeout();
        resolve();
      }
    }, interval);
  });
}

export default function RobotHome() {
  const [searchParams] = useSearchParams();
  const rawRobotId = searchParams.get("robotId");
  const robotIdMatch = rawRobotId?.match(/(\d+)$/);
  const robotId = robotIdMatch ? Number(robotIdMatch[1]) : NaN;

  const [process, setProcess] = useState<ProcessState>(initialProcessState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const steps = [
    {
      label: "대기",
      isCompleted: process.currentStep > 0,
      isActive: process.currentStep === 0,
    },
    {
      label: "도서 인식",
      isCompleted: process.currentStep > 1,
      isActive: process.currentStep === 1,
    },
    {
      label: "회원 확인",
      isCompleted: process.currentStep > 2,
      isActive: process.currentStep === 2,
    },
    {
      label: "대출 결과",
      isCompleted: process.currentStep === 3,
      isActive: process.currentStep === 3,
    },
  ];
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handleBackButton);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault(); // Block refresh
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
        resetProcess();
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (process.userInfo) {
      setProcess((prev) => ({ ...prev, currentStep: 2 }));
    }
  }, [process.userInfo]);

  useEffect(() => {
    if (process.currentStep === 3) {
      const timeout = setTimeout(() => {
        resetProcess();
      }, 20000);
      return () => clearTimeout(timeout);
    }
  }, [process.currentStep]);

  const resetProcess = () => {
    setProcess(initialProcessState);
    setErrorMessage(null);
  };

  const handleBookRecognition = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    await pollData(
      () => fetchBookInfoFront({ robotId }),
      async (book) => {
        let enrichedBook = mapToBookCardVertical(book);
        enrichedBook = await fillBookDetailsKakao2(enrichedBook);

        if (isBookCardVertical(enrichedBook)) {
          setProcess((prev) => ({
            ...prev,
            bookInfo: enrichedBook,
            currentStep: 1,
          }));
        } else {
          setErrorMessage("도서 정보가 올바르지 않습니다.");
        }
      },
      () => setErrorMessage("다시 시도해주세요.")
    ).finally(() => setIsLoading(false));
  };

  const handleMemberRecognition = async () => {
    setIsLoading(true);
    setLoadingMessage("회원 QR코드를 카메라에 인식해주십시오.");
    setErrorMessage(null);

    await pollData(
      () => fetchUserInfoService({ robotId }),
      (user) => {
        setProcess((prev) => ({
          ...prev,
          userInfo: user,
          currentStep: 2,
        }));
      },
      () => setErrorMessage("회원 정보를 가져오는 데 실패했습니다.")
    ).finally(() => {
      setIsLoading(false);
      setLoadingMessage(null);
    });
  };

  const handleBorrow = async () => {
    if (!process.bookInfo || !process.userInfo) {
      setErrorMessage("대출에 필요한 정보가 부족합니다.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const borrowRequest: BookBorrowRequestDto = {
        bookId: process.bookInfo.id,
        robotId,
        userId: process.userInfo.userId,
      };
      const result = await borrowBookService(borrowRequest);

      if (result?.isDone) {
        setProcess((prev) => ({
          ...prev,
          borrowResult: {
            message: "대출이 완료되었습니다.",
            status: "success",
            returnDate: calculateReturnDate(),
          },
          currentStep: 3,
        }));
      } else {
        setProcess((prev) => ({
          ...prev,
          borrowResult: {
            message: result?.message || "대출이 불가합니다.",
            status: "error",
          },
          currentStep: 3,
        }));
      }
    } catch {
      setErrorMessage("대출 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-[600px] w-[1024px] bg-snow text-gray-800 py-10 px-6">
      <div className="w-full">
        <StepIndicator steps={steps} currentStep={process.currentStep} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={process.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center w-full h-[400px]"
        >
          {isLoading ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 border-8 border-orange border-t-transparent rounded-full animate-spin"></div>
              {loadingMessage && (
                <h1 className="text-3xl font-bold">{loadingMessage}</h1>
              )}
            </div>
          ) : errorMessage ? (
            <div className="flex items-center space-x-4 text-orange">
              <AlertCircle size={40} />
              <h1 className="text-3xl font-bold">{errorMessage}</h1>
            </div>
          ) : process.currentStep === 1 && process.bookInfo ? (
            <div className="flex items-center justify-center gap-8 w-full">
              <div className="w-48 aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                <img
                  src={process.bookInfo.coverImageUrl || "/placeholder.svg"}
                  alt={process.bookInfo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start text-left">
                {process.bookInfo.status === "대출 가능" ? (
                  <h2 className="text-4xl font-bold">
                    『{process.bookInfo.title}』을(를) <br />
                    대출하시겠습니까?
                  </h2>
                ) : (
                  <div className="flex items-center gap-4 text-orange">
                    <AlertCircle size={40} />
                    <p className="text-3xl font-semibold">
                      {process.bookInfo.status}인 도서입니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : process.currentStep === 2 && process.userInfo ? (
            <div className="flex flex-col items-center space-y-8">
              <User size={64} className="text-orange" />
              {process.userInfo.userStatus === "대출 가능" ? (
                <p className="text-5xl font-bold text-center">
                  {process.userInfo.userName}님, <br />
                  대출하시겠습니까?
                </p>
              ) : (
                <p className="text-5xl font-bold text-center">
                  {process.userInfo.userName}님, <br />
                  {process.userInfo.userStatus}
                </p>
              )}
            </div>
          ) : process.currentStep === 3 && process.borrowResult ? (
            <div className="flex flex-col items-center space-y-8">
              {process.borrowResult.status === "success" ? (
                <CheckCircle size={64} className="text-blue" />
              ) : (
                <AlertCircle size={64} className="text-orange" />
              )}
              <p
                className={`text-5xl font-bold text-center ${
                  process.borrowResult.status === "success"
                    ? "text-blue"
                    : "text-orange"
                }`}
              >
                {process.borrowResult.message}
              </p>
              {process.borrowResult.status === "success" && (
                <p className="text-3xl text-center">
                  반납 예정일 {process.borrowResult.returnDate}
                </p>
              )}
            </div>
          ) : process.currentStep === 0 ? (
            <div className="flex flex-col items-center space-y-8">
              <Book size={64} className="text-orange" />
              <h1 className="text-5xl font-bold text-center">
                대출하실 도서를 <br />한 권씩 올려 주세요.
              </h1>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="w-full flex justify-center space-x-6">
        {process.currentStep > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetProcess}
            className="px-10 py-5 text-2xl font-semibold text-white bg-gray-500 rounded-2xl hover:bg-gray-600 transition-colors shadow-lg"
          >
            처음으로
          </motion.button>
        )}

        {!isLoading && process.currentStep < 3 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={
              process.currentStep === 0
                ? handleBookRecognition
                : process.currentStep === 1
                  ? handleMemberRecognition
                  : handleBorrow
            }
            disabled={
              (process.currentStep === 1 &&
                process.bookInfo?.status !== "대출 가능") ||
              (process.currentStep === 2 &&
                process.userInfo?.userStatus !== "대출 가능")
            }
            className="px-16 py-6 text-3xl font-bold text-white bg-orange rounded-2xl hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            대출하기
          </motion.button>
        )}
      </div>
    </div>
  );
}
