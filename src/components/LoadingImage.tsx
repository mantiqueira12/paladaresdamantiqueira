import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement>;

export default function LoadingImage({ src, srcSet, onLoad, onError, ...props }: Props) {
  const imagemRef = useRef<HTMLImageElement>(null);
  const [pendente, setPendente] = useState(Boolean(src || srcSet));

  useEffect(() => {
    const imagem = imagemRef.current;
    setPendente(Boolean(src || srcSet));
    if (!imagem) return;
    const frame = requestAnimationFrame(() => {
      if (imagem.complete) setPendente(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [src, srcSet]);

  const carregar = (evento: SyntheticEvent<HTMLImageElement>) => {
    if (evento.currentTarget.complete) setPendente(false);
    onLoad?.(evento);
  };
  const falhar = (evento: SyntheticEvent<HTMLImageElement>) => {
    const origemAntes = evento.currentTarget.getAttribute('src');
    onError?.(evento);
    const imagem = evento.currentTarget;
    const origemDepois = imagem.getAttribute('src');
    if (origemDepois !== origemAntes) {
      setPendente(true);
      requestAnimationFrame(() => {
        if (imagem.complete) setPendente(false);
      });
    } else {
      setPendente(!imagem.complete);
    }
  };

  return (
    <img
      {...props}
      alt={props.alt}
      ref={imagemRef}
      src={src}
      srcSet={srcSet}
      data-image-pending={pendente ? 'true' : undefined}
      onLoad={carregar}
      onError={falhar}
    />
  );
}
