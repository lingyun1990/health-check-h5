import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf6e9] px-5 py-6 text-ink motion-safe:animate-soft-fade-in">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between">
        <div className="relative flex flex-1 flex-col items-center justify-center pt-5">
          <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ffe28a]/40 blur-3xl" />

          <div className="relative z-20 mb-[-1.35rem] w-[min(20rem,92vw)] rounded-[26px] border border-[#eadfca] bg-white/88 px-5 py-4 text-center shadow-[0_18px_38px_rgba(134,88,31,0.13)] backdrop-blur motion-safe:animate-bubble-in">
            <p className="text-[20px] font-semibold leading-8 tracking-normal text-[#2b261f]">
              我是凌云老师的助理，您好鸭
            </p>
            <p className="mt-1 text-[19px] font-semibold leading-8 tracking-normal text-leaf">
              由我带您完成这次身体自检
            </p>
          </div>

          <div className="relative z-10 h-[26rem] w-full max-w-[23rem]" aria-hidden="true">
            <div className="absolute inset-x-12 bottom-7 h-8 rounded-full bg-[#d8c7a6]/55 blur-lg" />
            <img
              src="/images/duck-assistant-cutout.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_28px_34px_rgba(134,88,31,0.18)] motion-safe:animate-duck-bob"
            />
          </div>
        </div>

        <div className="pb-2 text-center">
          <p className="mx-auto whitespace-nowrap text-[13px] font-medium leading-6 text-ink/54">
            按最近的真实感受勾选即可，不用想太久。
          </p>

        <Link
          href="/evaluate"
          className="mt-7 flex h-13 min-h-13 w-full items-center justify-center rounded-2xl bg-leaf px-5 text-base font-semibold text-white shadow-[0_16px_32px_rgba(45,106,79,0.22)] transition duration-200 ease-out active:scale-[0.985] active:bg-[#245b43]"
        >
          开始录入
        </Link>

          <p className="mt-4 text-xs leading-6 text-ink/40">结果仅作健康管理参考，不替代医学诊断。</p>
        </div>
      </section>
    </main>
  );
}
