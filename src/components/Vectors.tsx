export function Envelope() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="368.625"
      height="368.625"
      viewBox="0 0 368.625 368.325"
      enableBackground="new 0 0 368.625 368.625"
      style={{ width: "20px", height: "20px" }}
      className="fill-gray-300"
    >
      <path d="M356.125 50.318H12.5c-6.903 0-12.5 5.597-12.5 12.5v242.988c0 6.902 5.597 12.5 12.5 12.5h343.625c6.902 0 12.5-5.598 12.5-12.5V62.818c0-6.902-5.598-12.5-12.5-12.5zm-12.5 242.989H25V75.318h318.625v217.989z"></path>
      <path d="M57.755 134.201l120 73.937c2.01 1.239 4.283 1.858 6.557 1.858s4.547-.619 6.557-1.858l120-73.937c5.877-3.621 7.707-11.322 4.086-17.199s-11.324-7.707-17.199-4.085l-113.444 69.896-113.443-69.896c-5.875-3.619-13.576-1.793-17.199 4.085-3.622 5.876-1.793 13.578 4.085 17.199z"></path>
    </svg>
  );
}

export function Pause() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-[100px] h-[100px]"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function Play() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-[100px] h-[100px]"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
  );
}

export function ExternalLink() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 relative -top-[1px] transition-all duration-300 group-hover:scale-125"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}
