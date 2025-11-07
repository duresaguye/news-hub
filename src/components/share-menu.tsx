'use client';

import { useState, cloneElement, isValidElement, type MouseEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Facebook, Linkedin, Twitter, Link as LinkIcon, Share2 } from 'lucide-react';

type ShareMenuProps = {
  shareUrl: string;
  title: string;
  description?: string | null;
  children: React.ReactElement<{ onClick?: (event: MouseEvent) => void }>;
};

const SHARE_TARGETS = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    getUrl: (url: string, title: string, description?: string | null) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(
        title
      )}&summary=${encodeURIComponent(description ?? '')}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

const getAbsoluteUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (typeof window === 'undefined') return url;
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
};

export function ShareMenu({ shareUrl, title, description, children }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const normalizedUrl = getAbsoluteUrl(shareUrl);

  const handleOpenTarget = (targetUrl: string) => {
    if (!targetUrl) {
      toast({
        title: 'Unable to share',
        description: 'We could not create a share link for this article.',
        variant: 'destructive',
      });
      return;
    }

    const features = 'noopener,noreferrer,width=600,height=600';
    window.open(targetUrl, '_blank', features);
    setOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(normalizedUrl);
        toast({
          title: 'Link copied',
          description: 'Article link copied to your clipboard.',
        });
      } else {
        throw new Error('Clipboard not supported');
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to copy share link', error);
      toast({
        title: 'Could not copy link',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  const handleDeviceShare = async () => {
    if (!(typeof navigator !== 'undefined' && 'share' in navigator)) {
      handleCopyLink();
      return;
    }

    try {
      await (navigator as any).share({
        title,
        text: description ?? undefined,
        url: normalizedUrl,
      });
      toast({
        title: 'Shared',
        description: 'The article link is ready to share.',
      });
      setOpen(false);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return;
      }
      console.error('Failed to share via device', error);
      toast({
        title: 'Could not share',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  if (!isValidElement(children)) {
    throw new Error('ShareMenu expects a single React element as its child.');
  }

  const trigger = cloneElement(children, {
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      children.props.onClick?.(event);
    },
  });

  const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-56 p-3 space-y-3" align="end">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Share2 className="w-4 h-4" />
          Share article
        </div>
        <div className="grid gap-2">
          {SHARE_TARGETS.map(({ name, icon: Icon, getUrl }) => (
            <Button
              key={name}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => handleOpenTarget(getUrl(normalizedUrl, title, description))}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Button>
          ))}
        </div>
        <div className="border-t border-muted pt-2 mt-2 grid gap-2">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleCopyLink}>
            <LinkIcon className="w-4 h-4" />
            <span>Copy link</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleDeviceShare}
          >
            <Share2 className="w-4 h-4" />
            <span>{canUseNativeShare ? 'Share via device' : 'Share via your apps'}</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}