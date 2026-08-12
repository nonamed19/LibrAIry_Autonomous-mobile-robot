import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, BookOpenCheck, CheckCircle2, RotateCcw, UserRound } from "lucide-react";
import StepIndicator from "../../components/ui/step-indicator";
import BookCardVertical from "../../components/common/BookCardVertical";
import {
  borrowBookService,
  completeBookReturnService,
  fetchBookInfoFront,
  startBookReturnService,
} from "../../services/bookService";
import { fetchUserInfoService } from "../../services/userService";
import { fillBookDetailsKakao2 } from "../../utils/fillBookDetailsNaver";
import { mapToBookCardVertical } from "../../utils/transformers";
import { isBookCardVertical } from "../../utils/validators";
import type { BookCardVertical as BookCardVerticalType } from "../../types/book";
import type { UserFrontResponseDto } from "../../backapi/data-contracts";

type Operation = "borrow" | "return";
type Stage = "idle" | "book" | "member" | "return-started" | "complete";

const POLL_INTERVAL = 700;
const POLL_TIMEOUT = 15_000;

async function pollFor<T>(request: () => Promise<T | null>): Promise<T | null> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < POLL_TIMEOUT) {
    const value = await request();
    if (value) return value;
    await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL));
  }
  return null;
}

const returnDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(date);
};

export default function RobotHome() {
  const [params] = useSearchParams();
  const robotId = Number(params.get("robotId"));
  const [operation, setOperation] = useState<Operation>("borrow");
  const [stage, setStage] = useState<Stage>("idle");
  const [book, setBook] = useState<BookCardVerticalType | null>(null);
  const [member, setMember] = useState<UserFrontResponseDto | null>(null);
  const [arriveZoneId, setArriveZoneId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const isBusy = Boolean(loadingMessage);
  const reset = () => {
    setStage("idle");
    setBook(null);
    setMember(null);
    setArriveZoneId(null);
    setMessage(null);
    setLoadingMessage(null);
  };

  const recognizeBook = async () => {
    setMessage(null);
    setLoadingMessage("도서를 확인하고 있습니다…");
    try {
      const response = await pollFor(() => fetchBookInfoFront({ robotId }));
      if (!response) {
        setMessage("도서를 인식하지 못했습니다. 도서를 다시 올려 주세요.");
        return;
      }
      const enriched = await fillBookDetailsKakao2(mapToBookCardVertical(response));
      if (!isBookCardVertical(enriched)) {
        setMessage("인식된 도서 정보가 올바르지 않습니다.");
        return;
      }
      setBook(enriched);
      setStage("book");
    } catch {
      setMessage("도서 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoadingMessage(null);
    }
  };

  const recognizeMember = async () => {
    setMessage(null);
    setLoadingMessage("회원 QR 코드를 확인하고 있습니다…");
    try {
      const response = await pollFor(() => fetchUserInfoService({ robotId }));
      if (!response) {
        setMessage("회원 정보를 인식하지 못했습니다. QR 코드를 다시 보여 주세요.");
        return;
      }
      setMember(response);
      setStage("member");
    } catch {
      setMessage("회원 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoadingMessage(null);
    }
  };

  const borrow = async () => {
    if (!book?.id || !member?.userId) return;
    setLoadingMessage("대출을 처리하고 있습니다…");
    try {
      const result = await borrowBookService({ bookId: book.id, robotId, userId: member.userId });
      setMessage(result?.isDone ? "대출이 완료되었습니다." : result?.message || "대출을 완료하지 못했습니다.");
      setStage("complete");
    } catch {
      setMessage("대출 처리 중 문제가 발생했습니다.");
    } finally {
      setLoadingMessage(null);
    }
  };

  const startReturn = async () => {
    if (!book?.id) return;
    setLoadingMessage("반납 위치를 확인하고 있습니다…");
    try {
      const result = await startBookReturnService({ bookId: book.id, robotId });
      if (typeof result?.arriveZoneId !== "number") {
        setMessage("반납 위치를 확인하지 못했습니다.");
        return;
      }
      setArriveZoneId(result.arriveZoneId);
      setStage("return-started");
    } catch {
      setMessage("반납을 시작하지 못했습니다.");
    } finally {
      setLoadingMessage(null);
    }
  };

  const finishReturn = async () => {
    if (!book?.id) return;
    setLoadingMessage("반납을 완료하고 있습니다…");
    try {
      const result = await completeBookReturnService({ bookId: book.id, robotId });
      setMessage(result?.isDone ? "반납이 완료되었습니다." : result?.message || "반납을 완료하지 못했습니다.");
      setStage("complete");
    } catch {
      setMessage("반납 완료 처리 중 문제가 발생했습니다.");
    } finally {
      setLoadingMessage(null);
    }
  };

  if (!Number.isInteger(robotId) || robotId <= 0) {
    return <KioskError text="유효한 로봇 번호가 필요합니다. 관리자 화면에서 다시 열어 주세요." />;
  }

  const steps = operation === "borrow"
    ? ["도서 인식", "회원 확인", "대출 완료"]
    : ["도서 인식", "회수 구역 안내", "반납 완료"];
  const activeStep = stage === "idle" || stage === "book" ? 0 : stage === "member" || stage === "return-started" ? 1 : 2;

  return (
    <main className="kiosk-shell">
      <div className="kiosk-topbar">
        <div>
          <p className="eyebrow">LIBRAIRY ROBOT #{robotId}</p>
          <h1>스마트 대출 · 반납</h1>
        </div>
        <div className="kiosk-toggle" aria-label="서비스 선택">
          <button className={operation === "borrow" ? "active" : ""} onClick={() => { setOperation("borrow"); reset(); }}>대출</button>
          <button className={operation === "return" ? "active" : ""} onClick={() => { setOperation("return"); reset(); }}>반납</button>
        </div>
      </div>

      <StepIndicator steps={steps.map((label, index) => ({ label, isActive: activeStep === index, isCompleted: activeStep > index }))} currentStep={activeStep} />

      <section className="kiosk-content" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={`${operation}-${stage}-${message}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="kiosk-panel">
            {isBusy ? <LoadingState message={loadingMessage} /> : message && stage !== "complete" ? <KioskError text={message} /> : renderStage()}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="kiosk-actions">
        {stage !== "idle" && <button className="kiosk-secondary" onClick={reset}><RotateCcw size={24} /> 처음으로</button>}
        {stage === "idle" && <button className="kiosk-primary" onClick={recognizeBook}>도서 인식 시작</button>}
        {stage === "book" && operation === "borrow" && <button className="kiosk-primary" disabled={book?.status !== "대출 가능"} onClick={recognizeMember}>회원 QR 확인</button>}
        {stage === "book" && operation === "return" && <button className="kiosk-primary" onClick={startReturn}>반납 시작</button>}
        {stage === "member" && <button className="kiosk-primary" disabled={member?.userStatus !== "대출 가능"} onClick={borrow}>대출 확정</button>}
        {stage === "return-started" && <button className="kiosk-primary" onClick={finishReturn}>반납 완료</button>}
        {stage === "complete" && <button className="kiosk-primary" onClick={reset}>새로운 업무 시작</button>}
      </div>
    </main>
  );

  function renderStage() {
    if (stage === "idle") return <KioskIntro operation={operation} />;
    if (stage === "book" && book) return <BookRecognition book={book} operation={operation} />;
    if (stage === "member" && member) return <MemberRecognition member={member} />;
    if (stage === "return-started") return <ReturnGuide zoneId={arriveZoneId} />;
    if (stage === "complete") return <CompleteState message={message ?? "처리가 완료되었습니다."} operation={operation} />;
    return <KioskError text="처리 상태를 초기화해 주세요." />;
  }
}

const KioskIntro = ({ operation }: { operation: Operation }) => <div className="kiosk-intro"><BookOpenCheck size={80} /><h2>{operation === "borrow" ? "대출할 도서를 올려 주세요." : "반납할 도서를 올려 주세요."}</h2><p>도서 인식 후 화면의 안내에 따라 진행해 주세요.</p></div>;
const LoadingState = ({ message }: { message: string | null }) => <div className="kiosk-intro"><span className="kiosk-spinner" /><h2>{message}</h2><p>잠시만 기다려 주세요.</p></div>;
const KioskError = ({ text }: { text: string }) => <div className="kiosk-intro kiosk-error"><AlertCircle size={72} /><h2>다시 확인해 주세요</h2><p>{text}</p></div>;
const BookRecognition = ({ book, operation }: { book: BookCardVerticalType; operation: Operation }) => <div className="kiosk-book"><BookCardVertical {...book} /><div><p className="eyebrow">인식된 도서</p><h2>{book.title}</h2><p>{book.status}</p><strong>{operation === "borrow" ? "이 도서를 대출하시겠습니까?" : "이 도서를 반납하시겠습니까?"}</strong></div></div>;
const MemberRecognition = ({ member }: { member: UserFrontResponseDto }) => <div className="kiosk-intro"><UserRound size={80} /><h2>{member.userName}님, 대출을 진행할까요?</h2><p>{member.userStatus ?? "회원 상태를 확인해 주세요."}</p></div>;
const ReturnGuide = ({ zoneId }: { zoneId: number | null }) => <div className="kiosk-intro"><BookOpenCheck size={80} /><h2>회수 구역 {zoneId ?? "-"}번으로 이동합니다.</h2><p>도서를 회수함에 넣은 뒤 ‘반납 완료’를 눌러 주세요.</p></div>;
const CompleteState = ({ message, operation }: { message: string; operation: Operation }) => <div className="kiosk-intro kiosk-complete"><CheckCircle2 size={80} /><h2>{message}</h2><p>{operation === "borrow" ? `반납 예정일은 ${returnDate()}입니다.` : "도서 반납 내역이 저장되었습니다."}</p></div>;
