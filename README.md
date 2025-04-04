# AI Chatbot with PDF Upload

This is a [Next.js](https://nextjs.org) project that implements an AI-powered chatbot. The chatbot allows users to interact with an AI model and upload PDF files for content extraction and analysis.

## Features

- AI chatbot powered by the Gemini API.
- PDF upload and text extraction using [PDF.js](https://mozilla.github.io/pdf.js/).
- Real-time message updates with a clean and responsive UI.
- Built with modern React components and Tailwind CSS.

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-repo/myaichatbot.git
cd myaichatbot
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chatbot in action.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your actual API key for the Gemini API.

## File Upload

The chatbot supports uploading PDF files. The text content of the uploaded PDF is extracted and sent to the AI model for analysis. Ensure that the uploaded file is in PDF format.

## Project Structure

```
.
├── .env
├── components/
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   ├── components/
│   ├── lib/
├── README.md
├── package.json
└── tsconfig.json
```

- `src/app/page.tsx`: Main chatbot implementation.
- `src/components/`: Reusable UI components.
- `public/`: Static assets like images and icons.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs/getting-started.html) - Learn about React.
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/) - Learn about PDF.js for PDF parsing.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
