"use client";
import "highlight.js/styles/atom-one-dark.css";
import {EditorProvider } from "@tiptap/react";
import Blockquote from "@tiptap/extension-blockquote";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Italic from "@tiptap/extension-italic";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Gapcursor from "@tiptap/extension-gapcursor";
import Link from "@tiptap/extension-link";
import History from "@tiptap/extension-history";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import FileHandler from "@tiptap/extension-file-handler";
import { Markdown } from "@tiptap/markdown";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
import { EditorMenu } from "./editorMenu";
import { EditorUploadAction } from "./editorUploadAction";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, LineHeight, FontFamily } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'

interface RichTextEditorProps {
  content: string;
  onSubmit: (html: string) => void;
}

export const RichTextEditor = ({
  content,
  onSubmit,
}: RichTextEditorProps) => {
  // create a lowlight instance with all languages loaded
  const lowlight = createLowlight(all);
  const extensions = [
    Blockquote,
    BulletList,
    Document,
    Paragraph,
    Bold,
    Highlight.configure({
      multicolor: true,
    }),
    TextStyle,
    LineHeight,
    FontFamily,
    Markdown,
    Text,
    Typography,
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "javascript",
    }),
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
    }),
    ListItem,
    Image,
    Italic,
    Dropcursor,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Placeholder.configure({
      placeholder: "Write something ...",
      emptyEditorClass: 'is-editor-empty',
    }),
    TextAlign.configure({
      types: ["heading", "paragraph", "blockquote"],
    }),
    Gapcursor,
    History,
    Youtube.configure({
      controls: false,
      nocookie: true,
    }),
    FileHandler.configure({
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
        "image/jpg",
      ],
      onDrop: async (currentEditor, files, pos) => {
        const file = files[0] || null;
        const utData = await EditorUploadAction(file);
        if (!utData) {
          return;
        }
        const url = utData.ufsUrl;
        console.log(url);
        currentEditor?.chain().focus().setImage({ src: url }).run();
      },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
          }

          // disallowed protocols
          const disallowedProtocols = ["ftp", "file", "mailto"];
          const protocol = parsedUrl.protocol.replace(":", "");

          if (disallowedProtocols.includes(protocol)) {
            return false;
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === "string" ? p : p.scheme,
          );

          if (!allowedProtocols.includes(protocol)) {
            return false;
          }

          // disallowed domains
          const disallowedDomains = [
            "example-phishing.com",
            "malicious-site.net",
          ];
          const domain = parsedUrl.hostname;

          if (disallowedDomains.includes(domain)) {
            return false;
          }

          // all checks have passed
          return true;
        } catch {
          return false;
        }
      },
      shouldAutoLink: (url) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;

          return !disallowedDomains.includes(domain);
        } catch {
          return false;
        }
      },
    }),
  ];
  const editorProps = {
    attributes: {
      class:
        "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mb-2 max-w-xl mx-auto focus:outline-none p-4 rounded-lg min-h-[80vh]",
    },
  };

  return (
    <article className="rounded p-4 mx-4 mt-8 lg:mx-auto">
      <EditorProvider
        extensions={extensions}
        content={content}
        editorProps={editorProps}
        slotBefore={<EditorMenu />}
        immediatelyRender = {false}
        onUpdate={({ editor }) => {
          // You can handle content updates here if needed
          const html = editor.getHTML();
          // console.log("Editor content updated:", html);
          onSubmit(html);
        }}
      >

      </EditorProvider>
    </article>
  );
};
