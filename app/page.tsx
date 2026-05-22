import Image from "next/image";

export default function Home() {
  return (
    <main className="h-[calc(100vh-72px)] w-full overflow-hidden bg-background">
      <section className="grid h-full grid-cols-1 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex items-center px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <h1
              className="
                text-foreground
                text-5xl
                sm:text-6xl
                xl:text-7xl
                leading-[0.95]
                tracking-[-0.04em]
                font-medium
              "
            >
              Secure, Smart,
              <br />
              and Simple
              <br />
              Crypto Solutions
            </h1>

            <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-md">
              we empowers cryptocurrency transactions and safekeeping
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your Email"
                className="
                  h-14
                  flex-1
                  rounded-full
                  border
                  border-border
                  bg-transparent
                  px-6
                  text-foreground
                  outline-none
                  placeholder:text-muted-foreground
                  focus:border-ring
                  transition
                "
              />

              <button
                className="
                  h-14
                  px-8
                  rounded-full
                  bg-foreground
                  text-background
                  font-medium
                  hover:scale-[1.03]
                  active:scale-[0.98]
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative hidden overflow-hidden lg:block">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e7d2cb] via-[#d8b6d9] to-[#f3e2ae]" />

          {/* Hero Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/hero.png"
              alt="Crypto UI"
              width={850}
              height={900}
              priority
              className="
                w-[90%]
                h-auto
                object-contain
                translate-y-8
                scale-110
              "
            />
          </div>
        </div>
      </section>
    </main>
  );
}