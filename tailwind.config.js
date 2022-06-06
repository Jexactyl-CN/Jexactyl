const colors = require('tailwindcss/colors');

const gray = {
    50: 'hsl(216, 33%, 97%)',
    100: 'hsl(214, 15%, 91%)',
    200: 'hsl(210, 16%, 82%)',
    300: 'hsl(211, 13%, 65%)',
    400: 'hsl(211, 10%, 53%)',
    500: 'hsl(211, 12%, 43%)',
    600: 'hsl(209, 14%, 37%)',
    700: 'hsl(209, 18%, 30%)',
    800: 'hsl(209, 20%, 25%)',
    900: 'hsl(210, 24%, 16%)',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#131a20',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: colors.blue,
                gray: gray,
                cyan: colors.cyan,
                neutral: {
                    50: 'hsl(216, 33%, 97%)',
                    100: 'hsl(214, 15%, 91%)',
                    200: 'hsl(210, 16%, 82%)',
                    300: 'hsl(211, 13%, 65%)',
                    400: 'hsl(211, 10%, 53%)',
                    500: 'hsl(211, 12%, 43%)',
                    600: 'hsl(209, 14%, 37%)',
                    700: 'hsl(209, 18%, 30%)',
                    800: 'hsl(209, 20%, 25%)',
                    850: 'hsl(211, 22%, 21%)', // Background colour
                    875: 'hsl(210, 23%, 18%)', // Sidebar colour
                    900: 'hsl(210, 24%, 16%)', // Nav/Box colour
                },
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
