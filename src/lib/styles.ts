// Reusable style strings for consistency

export const button = {
  base: `
    px-4 py-2 rounded-lg text-sm font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none
  `,

  primary: `
    bg-gray-900 text-white
    hover:opacity-90
  `,

  secondary: `
    bg-gray-100 text-gray-900
    border border-gray-300
    hover:bg-gray-200
  `,

  destructive: `
    bg-red-500 text-white
    hover:bg-red-600
  `,

  ghost: `
    bg-transparent text-gray-700
    hover:bg-gray-100
  `,
};

export const input = `
  w-full h-10 px-3
  bg-gray-100
  border border-gray-300
  rounded-md
  text-sm text-gray-900
  placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export const card = {
  base: `
    bg-white
    border border-gray-300
    rounded-lg
  `,

  interactive: `
    bg-white
    border border-gray-300
    rounded-lg
    hover:bg-gray-50
    transition-colors
    cursor-pointer
  `,
};

export const infoButton = `
  p-2 rounded-lg
  backdrop-blur-sm bg-gray-100/80
  hover:bg-gray-200/80
  transition-colors
  border-0 cursor-pointer
`;

export const tab = {
  container: `
    bg-gray-600 rounded-lg p-1 flex gap-1
  `,

  button: (isActive: boolean) => `
    px-5 py-2 rounded-lg text-sm font-medium transition-all
    ${isActive ? 'bg-white text-gray-900' : 'text-gray-100 hover:bg-white/10'}
  `,
};
