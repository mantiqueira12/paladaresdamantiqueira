import { useEffect, useRef, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement>;

type LoadingImageProps = Omit<Props, 'onError'> & {
  onError?: Props['onError'];
  onImageFailure?: (image: HTMLImageElement) => void;
};

type ImageOrigin = { src: string | null; srcSet: string | null };

function encaminharFalha(
  imagem: HTMLImageElement,
  origemVerificadaRef: { current: ImageOrigin },
  erroEncaminhadoRef: { current: boolean },
  onImageFailureRef: { current: ((image: HTMLImageElement) => void) | undefined },
) {
  const origemAtual = { src: imagem.getAttribute('src'), srcSet: imagem.getAttribute('srcset') };
  if (!origemAtual.src && !origemAtual.srcSet) return;
  const origemAnterior = origemVerificadaRef.current;
  if (origemAtual.src !== origemAnterior.src || origemAtual.srcSet !== origemAnterior.srcSet) {
    origemVerificadaRef.current = origemAtual;
    erroEncaminhadoRef.current = false;
  }
  if (erroEncaminhadoRef.current) return;
  erroEncaminhadoRef.current = true;
  // O evento nativo pode ocorrer antes de React ligar o onError. Avisa o
  // dono da imagem usando o elemento real em vez de fabricar um evento.
  onImageFailureRef.current?.(imagem);
}

export default function LoadingImage({ src, srcSet, onLoad, onError, onImageFailure, ...props }: LoadingImageProps) {
  const imagemRef = useRef<HTMLImageElement>(null);
  const [pendente, setPendente] = useState(Boolean(src || srcSet));
  const origemVerificadaRef = useRef<ImageOrigin>({ src: null, srcSet: null });
  const erroEncaminhadoRef = useRef(false);
  const onImageFailureRef = useRef(onImageFailure);
  onImageFailureRef.current = onImageFailure;

  useEffect(() => {
    const imagem = imagemRef.current;
    setPendente(Boolean(src || srcSet));
    if (!imagem) return;
    const frame = requestAnimationFrame(() => {
      if (!imagem.complete) return;

      if (imagem.naturalWidth === 0) encaminharFalha(imagem, origemVerificadaRef, erroEncaminhadoRef, onImageFailureRef);

      setPendente(false);
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
    encaminharFalha(imagem, origemVerificadaRef, erroEncaminhadoRef, onImageFailureRef);
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
