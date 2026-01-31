'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, Type, Palette, Smile, RotateCcw } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
    isInvalid?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = '150px', isInvalid }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Initial value setup
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
             // Only update if significantly different to avoid cursor jumps
             if (value === '' && editorRef.current.innerHTML === '<br>') return;
             editorRef.current.innerHTML = value;
        }
    }, []); // Run once on mount, let internal state handle typing

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            onChange(editorRef.current.innerHTML); // Sync immediately
        }
    };

    const COLORS = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#997B55'];
    const FONTS = ['Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Courier New', 'DM Sans'];
    const EMOJIS = ['😀', '😍', '👍', '🔥', '✨', '🎉', '💯', '🛒', '📦', '🇮🇩'];

    return (
        <div className={`border rounded-xl overflow-hidden bg-white ${isInvalid ? 'border-red-500' : 'border-gray-300'}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 text-gray-700">
                <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded text-sm group" title="Bold">
                    <Bold size={16} />
                </button>
                <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Italic">
                    <Italic size={16} />
                </button>
                <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Underline">
                    <Underline size={16} />
                </button>
                
                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* Color Picker */}
                <div className="relative">
                    <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 hover:bg-gray-200 rounded text-sm flex items-center gap-1">
                        <Palette size={16} />
                    </button>
                    {showColorPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)}></div>
                            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border z-50 grid grid-cols-5 gap-1 w-40">
                                {COLORS.map(c => (
                                    <button 
                                        key={c} type="button" 
                                        className="w-6 h-6 rounded-full border border-gray-100 hover:scale-110 transition-transform" 
                                        style={{ backgroundColor: c }}
                                        onClick={() => { execCommand('foreColor', c); setShowColorPicker(false); }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Font Picker */}
                <div className="relative">
                    <button type="button" onClick={() => setShowFontPicker(!showFontPicker)} className="p-2 hover:bg-gray-200 rounded text-sm flex items-center gap-1">
                        <Type size={16} />
                    </button>
                    {showFontPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowFontPicker(false)}></div>
                            <div className="absolute top-full left-0 mt-1 py-1 bg-white rounded-lg shadow-xl border z-50 w-40">
                                {FONTS.map(f => (
                                    <button 
                                        key={f} type="button" 
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm" 
                                        style={{ fontFamily: f }}
                                        onClick={() => { execCommand('fontName', f); setShowFontPicker(false); }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Emoji Picker */}
                <div className="relative">
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-gray-200 rounded text-sm flex items-center gap-1">
                        <Smile size={16} />
                    </button>
                    {showEmojiPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)}></div>
                            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border z-50 grid grid-cols-5 gap-1 w-40">
                                {EMOJIS.map(e => (
                                    <button 
                                        key={e} type="button" 
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                        onClick={() => { execCommand('insertText', e); setShowEmojiPicker(false); }}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                
                 <button type="button" onClick={() => execCommand('removeFormat')} className="p-2 hover:bg-gray-200 rounded text-sm text-red-500" title="Clear Formatting">
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Editable Area */}
            <div 
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-4 outline-none prose prose-sm max-w-none text-gray-800"
                style={{ minHeight }}
                data-placeholder={placeholder}
            />
             <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    display: block; /* For Firefox */
                }
            `}</style>
        </div>
    );
}
