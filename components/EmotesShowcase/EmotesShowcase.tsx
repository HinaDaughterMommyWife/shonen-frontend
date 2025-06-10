'use client';
import { EmoteData, setEmotesData } from '@/common/emotes';
import EmoteDecorator from '../EmoteDecorator';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import EmoteEditor from './EmoteEditor';
import { addToLocalStorageLimited, getLocalStorageArray } from '@/lib/localStorage';

interface EmotesShowcaseProps {
    emotesData: Record<string, EmoteData> | null;
}

export default function EmotesShowcase({ emotesData }: EmotesShowcaseProps) {
    setEmotesData(emotesData ?? {});

    const visibleRefs = useRef<Set<HTMLElement>>(new Set());
    const wrapperRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const hoveredEmoteRef = useRef<HTMLElement | null>(null);
    const zPressedRef = useRef(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmoteName, setSelectedEmoteName] = useState<string | null>('');
    const [emoteHistory, setEmoteHistory] = useState<string[]>([]);


    const emotesDataList = Object.values(emotesData ?? {}).map((emoteData) => ({
        username: emoteData.username,
        emotes: Object.entries(emoteData.emotes).map(([emoteName]) => emoteName),
    }));

    useEffect(() => {
        const history = getLocalStorageArray('emoteHistory');
        setEmoteHistory(history.slice(0, 20));
    }, []);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target as HTMLElement;

                    if (entry.isIntersecting) {
                        visibleRefs.current.add(el);

                        if (zPressedRef.current) {
                            el.classList.remove('opacity-0', 'opacity-100');
                            el.classList.add('opacity-20');
                        } else {
                            el.classList.remove('opacity-0', 'opacity-20');
                            el.classList.add('opacity-100');
                        }
                    } else {
                        visibleRefs.current.delete(el);
                        el.classList.remove('opacity-100', 'opacity-20');
                        el.classList.add('opacity-0');
                    }
                });
            },
            {
                threshold: 0.05,
            }
        );

        wrapperRefs.current.forEach((container) => {
            container.querySelectorAll('span').forEach((span) => {
                span.classList.add('opacity-0');
                observer.observe(span);
            });
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const applyOpacityOnVisible = (toZPressed: boolean) => {
            visibleRefs.current.forEach((el) => {
                if (toZPressed) {
                    el.classList.remove('opacity-100', 'opacity-0');
                    el.classList.add('opacity-20');
                } else {
                    el.classList.remove('opacity-20', 'opacity-0');
                    el.classList.add('opacity-100');
                }
            });
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'z' && !zPressedRef.current) {
                zPressedRef.current = true;
                applyOpacityOnVisible(true);
                if (hoveredEmoteRef.current) {
                    hoveredEmoteRef.current.classList.add('!opacity-100');
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === 'z' && zPressedRef.current) {
                zPressedRef.current = false;
                applyOpacityOnVisible(false);

                if (hoveredEmoteRef.current) {
                    hoveredEmoteRef.current.classList.remove('!opacity-100');
                    hoveredEmoteRef.current = null;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleMouseEnter = (emoteEl: HTMLElement) => {
        if (hoveredEmoteRef.current && hoveredEmoteRef.current !== emoteEl) {
            hoveredEmoteRef.current.classList.remove('!opacity-100');
        }
        hoveredEmoteRef.current = emoteEl;

        if (!zPressedRef.current) return;

        emoteEl.classList.add('!opacity-100');
    };

    const handleMouseLeave = (emoteEl: HTMLElement) => {
        if (!zPressedRef.current) {
            hoveredEmoteRef.current = null;
            return;
        }

        if (hoveredEmoteRef.current === emoteEl) {
            emoteEl.classList.remove('!opacity-100');
            hoveredEmoteRef.current = null;
        }
    };

    const handleClickEmote = (emoteName: string, isHistory?: boolean) => {
        if (zPressedRef.current) {
            setSelectedEmoteName(emoteName);
            setDialogOpen(true);
        } else {
            if ((window as any).stonks) {
                (window as any).stonks.event(`emote-copied-${emoteName}`)
            }
            if (!isHistory) {
                handleAddHistoryEmote(emoteName);
            }
            toast(`${emoteName} copiado al portapapeles.`, {
                duration: 2000,
                style: {
                    background: "#333",
                    color: "#fff",
                },
            })
            navigator.clipboard.writeText(emoteName)
        };
    }

    const handleAddHistoryEmote = (emoteName: string) => {
        addToLocalStorageLimited('emoteHistory', emoteName);
        setEmoteHistory((prev) => [emoteName, ...prev.slice(0, 19)]);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <EmoteDecorator>
                <div className="flex flex-col gap-medium w-full">
                    {emoteHistory.length > 0 && (
                        <div className="flex gap-medium justify-center py-2xlarge flex-col items-center min-h-[200px]">
                            <h1 className="text-3xl font-bold uppercase ">Historial</h1>
                            <div
                                ref={(el) => {
                                    if (el) {
                                        wrapperRefs.current.set('emoteHistory', el);
                                    }
                                }}
                                className="flex flex-wrap [&>*]:transition-opacity [&>*]:duration-300 w-full gap-small justify-center"
                            >
                                {emoteHistory.map((emoteName) => (
                                    <span
                                        key={emoteName}
                                        onClick={() => handleClickEmote(emoteName, true)}
                                        onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
                                        onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                                        className="cursor-pointer"
                                    >
                                        {emoteName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {emotesDataList.map((emoteData) => (
                        <div key={emoteData.username} className="flex flex-col gap-medium w-full">
                            <div className="flex gap-medium justify-center py-2xlarge">
                                <h1 className="text-3xl font-bold uppercase ">
                                    {emoteData.username}
                                </h1>
                            </div>
                            <div
                                ref={(el) => {
                                    if (el) {
                                        wrapperRefs.current.set(emoteData.username, el);
                                    }
                                }}
                                className="flex flex-wrap [&>*]:transition-opacity [&>*]:duration-300 w-full gap-small justify-center"
                            >
                                {/* {emoteData.emotes.map((emoteName) => (
                                    <span
                                        key={emoteName}
                                        onClick={() => handleClickEmote(emoteName)}
                                        onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
                                        onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                                        className="cursor-pointer relative"
                                    >
                                        {emoteName}
                                    </span>
                                ))} */}
                                {emoteData.emotes.filter((emoteName) => !emoteName.includes('Pit') && !emoteName.includes('Toes')).map((emoteName) => (
                                    <span
                                        key={emoteName}
                                        onClick={() => handleClickEmote(emoteName)}
                                        onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
                                        onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                                        className="cursor-pointer relative"
                                    >
                                        {emoteName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </EmoteDecorator>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir efectos a {selectedEmoteName}</DialogTitle>
                </DialogHeader>
                <EmoteEditor emoteName={selectedEmoteName ?? ''} handleAddHistoryEmote={handleAddHistoryEmote} />
            </DialogContent>
        </Dialog>
    );
}
