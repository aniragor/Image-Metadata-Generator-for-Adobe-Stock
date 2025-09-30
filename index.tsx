/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

// --- Type Definitions ---
interface UploadedImage {
  mimeType: string;
  data: string;
}

interface MetadataResponse {
    title: string;
    keywords: string;
    category: string;
}

interface ImageFile {
  id: string;
  file: File;
  generativePart: UploadedImage;
  previewUrl: string;
}

// --- Localization ---
const LANGUAGES: { [key: string]: string } = {
    'en': 'English',
    'ru': 'Русский',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'it': 'Italiano',
    'pt': 'Português'
};

const TRANSLATIONS: { [key: string]: { [key: string]: string } } = {
    'en': {
        appTitle: "Image Metadata Generator",
        appDescription: "Upload one or more images to generate SEO-optimized titles, keywords, and categories using Gemini.",
        uploadButton: "Upload Image(s)",
        addMoreButton: "Add More Images",
        globalKeywordLabel: "Add a keyword for all images (optional)",
        globalKeywordPlaceholder: "e.g., celebration",
        generateButton: "Generate Metadata",
        clearAllButton: "Clear All",
        resultsPlaceholderUpload: "Upload one or more images to begin.",
        resultsPlaceholderReady: "Ready to generate metadata.",
        generatingStatus: "Generating {processed}/{total}...",
        completed: "Completed",
        processing: "Processing...",
        regenerating: "Regenerating...",
        errorStatus: "Error: {error}",
        title: "Title",
        category: "Category",
        keywords: "Keywords",
        regenerateLabel: "Refine with your keyword",
        regeneratePlaceholder: "e.g., smiling dog",
        regenerateButtonAria: "Regenerate with custom keyword",
        keywordRequired: "Keyword is required!",
        copyTitleAria: "Copy title",
        copyKeywordsAria: "Copy keywords",
        uiLanguageLabel: "App Language",
        metadataLanguageLabel: "Metadata Language",
        translatingKeyword: "Translating keyword...",
        translatingStatus: "Translating...",
    },
    'ru': {
        appTitle: "Генератор метаданных изображений",
        appDescription: "Загрузите одно или несколько изображений для создания SEO-оптимизированных заголовков, ключевых слов и категорий с помощью Gemini.",
        uploadButton: "Загрузить изображение(я)",
        addMoreButton: "Добавить еще",
        globalKeywordLabel: "Добавить ключевое слово для всех изображений (необязательно)",
        globalKeywordPlaceholder: "например, праздник",
        generateButton: "Сгенерировать метаданные",
        clearAllButton: "Очистить все",
        resultsPlaceholderUpload: "Загрузите одно или несколько изображений, чтобы начать.",
        resultsPlaceholderReady: "Готово к генерации метаданных.",
        generatingStatus: "Генерация {processed}/{total}...",
        completed: "Завершено",
        processing: "Обработка...",
        regenerating: "Повторная генерация...",
        errorStatus: "Ошибка: {error}",
        title: "Заголовок",
        category: "Категория",
        keywords: "Ключевые слова",
        regenerateLabel: "Уточнить с помощью вашего ключевого слова",
        regeneratePlaceholder: "например, улыбающаяся собака",
        regenerateButtonAria: "Повторно сгенерировать с пользовательским ключевым словом",
        keywordRequired: "Требуется ключевое слово!",
        copyTitleAria: "Копировать заголовок",
        copyKeywordsAria: "Копировать ключевые слова",
        uiLanguageLabel: "Язык приложения",
        metadataLanguageLabel: "Язык метаданных",
        translatingKeyword: "Перевод ключевого слова...",
        translatingStatus: "Перевод...",
    },
    'de': {
        appTitle: "Bild-Metadaten-Generator",
        appDescription: "Laden Sie ein oder mehrere Bilder hoch, um mit Gemini SEO-optimierte Titel, Schlüsselwörter und Kategorien zu generieren.",
        uploadButton: "Bild(er) hochladen",
        addMoreButton: "Weitere hinzufügen",
        globalKeywordLabel: "Ein Schlüsselwort für alle Bilder hinzufügen (optional)",
        globalKeywordPlaceholder: "z.B. Feier",
        generateButton: "Metadaten generieren",
        clearAllButton: "Alles löschen",
        resultsPlaceholderUpload: "Laden Sie ein oder mehrere Bilder hoch, um zu beginnen.",
        resultsPlaceholderReady: "Bereit zur Generierung von Metadaten.",
        generatingStatus: "Generiere {processed}/{total}...",
        completed: "Abgeschlossen",
        processing: "Verarbeitung...",
        regenerating: "Erneut generieren...",
        errorStatus: "Fehler: {error}",
        title: "Titel",
        category: "Kategorie",
        keywords: "Schlüsselwörter",
        regenerateLabel: "Mit Ihrem Schlüsselwort verfeinern",
        regeneratePlaceholder: "z.B. lächelnder Hund",
        regenerateButtonAria: "Mit benutzerdefiniertem Schlüsselwort erneut generieren",
        keywordRequired: "Schlüsselwort ist erforderlich!",
        copyTitleAria: "Titel kopieren",
        copyKeywordsAria: "Schlüsselwörter kopieren",
        uiLanguageLabel: "App-Sprache",
        metadataLanguageLabel: "Metadatensprache",
        translatingKeyword: "Schlüsselwort übersetzen...",
        translatingStatus: "Übersetzen...",
    },
    'fr': {
        appTitle: "Générateur de métadonnées d'image",
        appDescription: "Téléchargez une ou plusieurs images pour générer des titres, des mots-clés et des catégories optimisés pour le SEO avec Gemini.",
        uploadButton: "Télécharger image(s)",
        addMoreButton: "Ajouter plus",
        globalKeywordLabel: "Ajouter un mot-clé pour toutes les images (facultatif)",
        globalKeywordPlaceholder: "ex: célébration",
        generateButton: "Générer les métadonnées",
        clearAllButton: "Tout effacer",
        resultsPlaceholderUpload: "Téléchargez une ou plusieurs images pour commencer.",
        resultsPlaceholderReady: "Prêt à générer les métadonnées.",
        generatingStatus: "Génération {processed}/{total}...",
        completed: "Terminé",
        processing: "Traitement...",
        regenerating: "Régénération...",
        errorStatus: "Erreur : {error}",
        title: "Titre",
        category: "Catégorie",
        keywords: "Mots-clés",
        regenerateLabel: "Affiner avec votre mot-clé",
        regeneratePlaceholder: "ex: chien souriant",
        regenerateButtonAria: "Régénérer avec un mot-clé personnalisé",
        keywordRequired: "Mot-clé requis !",
        copyTitleAria: "Copier le titre",
        copyKeywordsAria: "Copier les mots-clés",
        uiLanguageLabel: "Langue de l'appli",
        metadataLanguageLabel: "Langue des métadonnées",
        translatingKeyword: "Traduction du mot-clé...",
        translatingStatus: "Traduction...",
    },
    'es': {
        appTitle: "Generador de metadatos de imágenes",
        appDescription: "Sube una o más imágenes para generar títulos, palabras clave y categorías optimizadas para SEO usando Gemini.",
        uploadButton: "Subir imagen(es)",
        addMoreButton: "Añadir más",
        globalKeywordLabel: "Añadir una palabra clave para todas las imágenes (opcional)",
        globalKeywordPlaceholder: "p. ej., celebración",
        generateButton: "Generar metadatos",
        clearAllButton: "Limpiar todo",
        resultsPlaceholderUpload: "Sube una o más imágenes para empezar.",
        resultsPlaceholderReady: "Listo para generar metadatos.",
        generatingStatus: "Generando {processed}/{total}...",
        completed: "Completado",
        processing: "Procesando...",
        regenerating: "Regenerando...",
        errorStatus: "Error: {error}",
        title: "Título",
        category: "Categoría",
        keywords: "Palabras clave",
        regenerateLabel: "Refinar con tu palabra clave",
        regeneratePlaceholder: "p. ej., perro sonriente",
        regenerateButtonAria: "Regenerar con palabra clave personalizada",
        keywordRequired: "¡Se requiere palabra clave!",
        copyTitleAria: "Copiar título",
        copyKeywordsAria: "Copiar palabras clave",
        uiLanguageLabel: "Idioma de la app",
        metadataLanguageLabel: "Idioma de los metadatos",
        translatingKeyword: "Traduciendo palabra clave...",
        translatingStatus: "Traduciendo...",
    },
    'it': {
        appTitle: "Generatore di metadati di immagine",
        appDescription: "Carica una o più immagini per generare titoli, parole chiave e categorie ottimizzate per la SEO utilizzando Gemini.",
        uploadButton: "Carica immagine/i",
        addMoreButton: "Aggiungi altre",
        globalKeywordLabel: "Aggiungi una parola chiave per tutte le immagini (opzionale)",
        globalKeywordPlaceholder: "es. celebrazione",
        generateButton: "Genera metadati",
        clearAllButton: "Cancella tutto",
        resultsPlaceholderUpload: "Carica una o più immagini per iniziare.",
        resultsPlaceholderReady: "Pronto per generare i metadati.",
        generatingStatus: "Generazione {processed}/{total}...",
        completed: "Completato",
        processing: "Elaborazione...",
        regenerating: "Rigenerazione...",
        errorStatus: "Errore: {error}",
        title: "Titolo",
        category: "Categoria",
        keywords: "Parole chiave",
        regenerateLabel: "Affina con la tua parola chiave",
        regeneratePlaceholder: "es. cane sorridente",
        regenerateButtonAria: "Rigenera con parola chiave personalizzata",
        keywordRequired: "Parola chiave richiesta!",
        copyTitleAria: "Copia titolo",
        copyKeywordsAria: "Copia parole chiave",
        uiLanguageLabel: "Lingua app",
        metadataLanguageLabel: "Lingua metadati",
        translatingKeyword: "Traduzione parola chiave...",
        translatingStatus: "Traduzione...",
    },
    'pt': {
        appTitle: "Gerador de metadados de imagem",
        appDescription: "Carregue uma ou mais imagens para gerar títulos, palavras-chave e categorias otimizadas para SEO usando o Gemini.",
        uploadButton: "Carregar imagem(ns)",
        addMoreButton: "Adicionar mais",
        globalKeywordLabel: "Adicionar uma palavra-chave para todas as imagens (opcional)",
        globalKeywordPlaceholder: "ex: celebração",
        generateButton: "Gerar metadados",
        clearAllButton: "Limpar tudo",
        resultsPlaceholderUpload: "Carregue uma ou mais imagens para começar.",
        resultsPlaceholderReady: "Pronto para gerar metadados.",
        generatingStatus: "Gerando {processed}/{total}...",
        completed: "Concluído",
        processing: "Processando...",
        regenerating: "Regenerando...",
        errorStatus: "Erro: {error}",
        title: "Título",
        category: "Categoria",
        keywords: "Palavras-chave",
        regenerateLabel: "Refinar com sua palavra-chave",
        regeneratePlaceholder: "ex: cão sorridente",
        regenerateButtonAria: "Regenerar com palavra-chave personalizada",
        keywordRequired: "Palavra-chave é obrigatória!",
        copyTitleAria: "Copiar título",
        copyKeywordsAria: "Copiar palavras-chave",
        uiLanguageLabel: "Idioma do aplicativo",
        metadataLanguageLabel: "Idioma dos metadados",
        translatingKeyword: "Traduzindo palavra-chave...",
        translatingStatus: "Traduzindo...",
    }
};

let currentUiLanguage = 'en';
let currentMetadataLanguage = 'en';


// --- Constants ---
const CATEGORIES_LIST = `You also should choose the Category for the image should be match one from the list below. Category: 1. Animals: Content related to animals, insects, or pets — at home or in the wild. 2. Buildings and Architecture: Structures like homes, interiors, offices, temples, barns, factories, and shelters. 3. Business: People in business settings, offices, business concepts, finance, and money 4. Drinks: Content related to beer, wine, spirits, and other drinks. 5. The Environment: Depictions of nature or the places we work and live. 6. States of Mind: Content related to people’s emotions and inner voices. 7. Food: Anything focused on food and eating. 8. Graphic Resources: Backgrounds, textures, and symbols. 9. Hobbies and Leisure: Pastime activities that bring joy and/or relaxation, such as knitting, building model airplanes, and sailing. 10. Industry: Depictions of work and manufacturing, like building cars, forging steel, producing clothing, or producing energy. 11. Landscape: Vistas, cities, nature, and other locations. 12. Lifestyle: The environments and activities of people at home, work, and play. 13. People: People of all ages, ethnicities, cultures, genders, and abilities. 14. Plants and Flowers: Close-ups of the natural world. 15. Culture and Religion: Depictions of the traditions, beliefs, and cultures of people around the world. 16. Science: Content with a focus on the applied, natural, medical, and theoretical sciences. 17. Social Issues: Poverty, inequality, politics, violence, and other depictions of social issues. 18. Sports: Content focused on sports and fitness, including football, basketball, hunting, yoga, and skiing. 19. Technology: Computers, smartphones, virtual reality, and other tools designed to increase productivity. 20. Transport: Different types of transportation, including cars, buses, trains, planes, and highway systems. 21. Travel: Local and worldwide travel, culture, and lifestyles.`;
const JSON_OUTPUT_INSTRUCTION = `IMPORTANT: Your entire output must be a single, valid JSON object with three keys: "title", "keywords", and "category". The "keywords" value should be a single string of comma-separated words.`;

const METADATA_PROMPT = `Write an SEO-optimized title for it, following the format [who or what is in the picture] [with what mood] [what they are doing or what it represents] [against what background] for images of living beings. For other types of images, use the format [what and in what style] [in what colors] [what it represents or what it is used for]. If the picture has a lot of empty space for text, add [with copy space] to the title. Next, provide 49 popular single-word keywords divided by image, including the following: What is depicted in the picture (considering the number or uniqueness of the object) Image angles, colors, moods, themes, locations, ages, skin tones, genders Relevant holidays for which this image may be suitable. If the image could be directly or indirectly related to a holiday, be sure to include that holiday. Do not use words that are already in the title; keywords should expand the search terms. The earlier a word appears in the list, the more relevant it should be to the search, meaning it's more likely that the word will be used to search for the image. Separate the keywords with commas. Be sure that you provide no more than 49 keywords. ${CATEGORIES_LIST} ${JSON_OUTPUT_INSTRUCTION}`;

const VECTOR_METADATA_PROMPT = `You are an expert in stock vector graphics. Your task is to generate metadata for a vector image (like an SVG). Write an SEO-optimized title for it, following the format [object or concept] [style, e.g., flat, isometric, line art] [main colors] [what it represents or is used for]. If the image has a lot of empty space for text, add [with copy space] to the title. Next, provide 49 popular single-word keywords. Crucially, include keywords related to vector graphics such as: vector, illustration, icon, graphic, design, element, symbol, clipart, editable, scalable. Also include keywords for: What is depicted in the picture, dominant colors, artistic style, themes, concepts, and potential use cases (e.g., web design, presentation, logo). Do not use words that are already in the title; keywords should expand the search terms. The earlier a word appears in the list, the more relevant it should be to the search. Separate the keywords with commas. Be sure that you provide no more than 49 keywords. ${CATEGORIES_LIST} ${JSON_OUTPUT_INSTRUCTION}`;

const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      keywords: { type: Type.STRING, description: 'A comma-separated list of keywords.' },
      category: { type: Type.STRING },
    },
    required: ['title', 'keywords', 'category'],
};


// --- DOM Element References ---
const generateButton = document.getElementById('generateButton') as HTMLButtonElement;
const clearAllButton = document.getElementById('clearAllButton') as HTMLButtonElement;
const actionsContainer = document.getElementById('actionsContainer') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
const uploadLabel = document.querySelector('label[for="imageUpload"]') as HTMLLabelElement;
const previewsContainer = document.getElementById('previewsContainer') as HTMLDivElement;
const resultsContainer = document.getElementById('resultsContainer') as HTMLDivElement;
const resultsPlaceholder = resultsContainer.querySelector('.placeholder') as HTMLDivElement;
const resultsList = document.getElementById('resultsList') as HTMLDivElement;
const modal = document.getElementById('imageModal') as HTMLDivElement;
const modalImage = document.getElementById('modalImage') as HTMLImageElement;
const modalClose = document.querySelector('.modal-close') as HTMLSpanElement;
const imagePreviewTooltip = document.getElementById('imagePreviewTooltip') as HTMLDivElement;
const globalKeywordInput = document.getElementById('globalKeywordInput') as HTMLInputElement;
const languageSelector = document.getElementById('languageSelector') as HTMLSelectElement;
const metadataLanguageSelector = document.getElementById('metadataLanguageSelector') as HTMLSelectElement;

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- State Management ---
const uploadedFiles = new Map<string, ImageFile>();

// --- Utility Functions ---

/**
 * Translates a keyword to the target metadata language if the UI language is different.
 * @param keyword The keyword to translate.
 * @returns The translated keyword, or the original keyword if no translation is needed or if translation fails.
 */
async function translateKeyword(keyword: string): Promise<string> {
    const trimmedKeyword = keyword.trim();
    if (currentUiLanguage === currentMetadataLanguage || !trimmedKeyword) {
        return trimmedKeyword;
    }

    console.log(`Translating "${trimmedKeyword}" from ${LANGUAGES[currentUiLanguage]} to ${LANGUAGES[currentMetadataLanguage]}`);
    try {
        const sourceLanguageName = LANGUAGES[currentUiLanguage];
        const targetLanguageName = LANGUAGES[currentMetadataLanguage];
        const prompt = `Translate the following keyword/phrase from ${sourceLanguageName} to ${targetLanguageName} and return only the translated text, without any additional explanations or quotation marks: "${trimmedKeyword}"`;
        
        const result: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const translated = result.text.trim();
        // The model might return the translation in quotes, so we remove them.
        return translated.replace(/^"|"$/g, '');
    } catch (error) {
        console.warn('Keyword translation failed. Using original keyword.', error);
        return trimmedKeyword; // Fallback to original
    }
}


/**
 * Sets the application's UI language, updates text, and stores the preference.
 * @param lang - The language code (e.g., 'en', 'ru').
 */
function setUiLanguage(lang: string) {
    if (!LANGUAGES[lang]) return;

    currentUiLanguage = lang;
    localStorage.setItem('uiLanguage', lang);
    languageSelector.value = lang;

    const translations = TRANSLATIONS[lang];

    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = (element as HTMLElement).dataset.lang!;
        const translation = translations[key];
        if (translation) {
            element.textContent = translation;
        }
    });

     document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = (element as HTMLElement).dataset.langPlaceholder!;
        const translation = translations[key];
        if (translation) {
            (element as HTMLInputElement).placeholder = translation;
        }
    });
    
    // Update dynamic text content
    renderPreviews(); 
    resetUI(false); // Update placeholders without clearing files
}

/**
 * Sets the metadata language and stores the preference.
 * @param lang - The language code (e.g., 'en', 'ru').
 */
function setMetadataLanguage(lang: string) {
    if (!LANGUAGES[lang]) return;
    currentMetadataLanguage = lang;
    localStorage.setItem('metadataLanguage', lang);
    metadataLanguageSelector.value = lang;
}

/**
 * Creates a generative prompt, including language and optional custom keyword.
 * @param langCode - The language code for the output.
 * @param fileType - The MIME type of the file.
 * @param customKeyword - The user-provided keyword (optional).
 * @returns The full prompt string.
 */
function createPrompt(langCode: string, fileType: string, customKeyword?: string): string {
    const isVector = fileType === 'image/svg+xml';
    const basePrompt = isVector ? VECTOR_METADATA_PROMPT : METADATA_PROMPT;
    
    const languageName = LANGUAGES[langCode] || 'English';
    const languageInstruction = `The entire response, including title, keywords, and category names, MUST be in ${languageName}.`;

    const trimmedKeyword = customKeyword?.trim();
    if (trimmedKeyword) {
        return `IMPORTANT: You MUST include the custom keyword "${trimmedKeyword}" in both the generated title and the generated list of keywords. Prioritize this keyword. ${languageInstruction} The rest of your instructions are as follows: ${basePrompt}`;
    }
    return `${languageInstruction} ${basePrompt}`;
}

/**
 * Opens the image preview modal.
 */
function openModal(src: string, alt: string) {
  if (modal && modalImage) {
    modal.style.display = 'flex';
    modalImage.src = src;
    modalImage.alt = alt;
  }
}

/**
 * Closes the image preview modal.
 */
function closeModal() {
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Converts a file to a base64 encoded string. For formats not directly supported by the API (SVG, GIF, BMP),
 * it converts them to PNG format before encoding.
 * @param file The image file to process.
 * @returns A promise that resolves to an object containing the mimeType and base64 data.
 */
async function fileToGenerativePart(file: File): Promise<UploadedImage> {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // If type is supported by Gemini, just encode it
    if (supportedTypes.includes(file.type)) {
        const base64EncodedDataPromise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            mimeType: file.type,
            data: await base64EncodedDataPromise,
        };
    }

    // For unsupported types, convert to PNG via canvas
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error('FileReader did not return a result.'));
            }
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_DIMENSION = 1024; // To prevent massive uploads
                let width = img.naturalWidth;
                let height = img.naturalHeight;

                // For SVGs without intrinsic dimensions, we might need a default
                if (file.type === 'image/svg+xml' && (width === 0 || height === 0)) {
                    width = 300; // A reasonable default
                    height = 300;
                }

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height = Math.round(height * (MAX_DIMENSION / width));
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width = Math.round(width * (MAX_DIMENSION / height));
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                try {
                    const dataUrl = canvas.toDataURL('image/png');
                    const base64Data = dataUrl.split(',')[1];
                     if (!base64Data) {
                        return reject(new Error('Failed to extract base64 data from canvas.'));
                    }
                    resolve({
                        mimeType: 'image/png', // The new, supported MIME type
                        data: base64Data,
                    });
                } catch (e) {
                    reject(new Error(`Canvas toDataURL failed: ${e}`));
                }
            };
            img.onerror = (err) => {
                reject(new Error(`Failed to load image for conversion: ${file.name}. Error: ${err}`));
            };
            img.src = event.target.result as string;
        };
        reader.onerror = (err) => {
            reject(new Error(`Failed to read file: ${file.name}. Error: ${err}`));
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Sets up a copy button to copy text from a source element or a string to the clipboard.
 */
function setupCopyButton(button: HTMLButtonElement, source: HTMLElement | string) {
    button.addEventListener('click', () => {
        const textToCopy = typeof source === 'string' ? source : source.textContent;
        if (textToCopy && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHTML = button.innerHTML;
                button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                button.disabled = true;
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text.');
            });
        }
    });
}

/**
 * Renders the preview thumbnails for all uploaded images.
 */
function renderPreviews() {
    previewsContainer.innerHTML = '';
    const translations = TRANSLATIONS[currentUiLanguage];

    if (uploadedFiles.size === 0) {
        previewsContainer.style.display = 'none';
        uploadLabel.textContent = translations.uploadButton;
        generateButton.disabled = true;
        clearAllButton.style.display = 'none';
        actionsContainer.style.gridTemplateColumns = '1fr';
        return;
    }

    previewsContainer.style.display = 'grid';
    uploadLabel.textContent = translations.addMoreButton;
    generateButton.disabled = false;
    clearAllButton.style.display = 'block';
    actionsContainer.style.gridTemplateColumns = '2fr 1fr';


    for (const [id, fileData] of uploadedFiles.entries()) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${fileData.previewUrl}" alt="${fileData.file.name}">
            <button class="remove-btn" data-id="${id}" aria-label="Remove ${fileData.file.name}">&times;</button>
        `;
        previewsContainer.appendChild(previewItem);
    }
}


/**
 * Resets the UI to its initial state.
 * @param clearFiles - Whether to clear the uploaded files map.
 */
function resetUI(clearFiles = true) {
    if (clearFiles) {
        for(const fileData of uploadedFiles.values()) {
            URL.revokeObjectURL(fileData.previewUrl);
        }
        uploadedFiles.clear();
    }
    
    resultsList.innerHTML = '';
    resultsList.style.display = 'none';
    if (resultsPlaceholder) {
      resultsPlaceholder.style.display = 'flex';
      const placeholderText = resultsPlaceholder.querySelector('p');
      if(placeholderText) {
          placeholderText.textContent = TRANSLATIONS[currentUiLanguage].resultsPlaceholderUpload;
      }
    }
    imageUpload.value = '';
    globalKeywordInput.value = '';
    errorMessage.textContent = '';
    
    renderPreviews();
}

/**
 * Positions the image preview tooltip.
 */
function positionTooltip(e: MouseEvent) {
    if (!imagePreviewTooltip) return;

    const offsetX = 15;
    const offsetY = 15;
    const tooltipWidth = imagePreviewTooltip.offsetWidth;
    const tooltipHeight = imagePreviewTooltip.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = e.clientX + offsetX;
    let y = e.clientY + offsetY;

    if (x + tooltipWidth > viewportWidth) x = e.clientX - tooltipWidth - offsetX;
    if (y + tooltipHeight > viewportHeight) y = e.clientY - tooltipHeight - offsetY;
    if (x < 0) x = offsetX;
    if (y < 0) y = offsetY;

    imagePreviewTooltip.style.left = `${x}px`;
    imagePreviewTooltip.style.top = `${y}px`;
}

/**
 * Sets up hover event listeners to show an image preview tooltip.
 */
function setupImageHoverPreview(container: HTMLElement) {
    container.addEventListener('mouseover', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
            const imgElement = target as HTMLImageElement;
            
            const rect = imgElement.getBoundingClientRect();
            imagePreviewTooltip.style.width = `${rect.width * 3}px`;
            imagePreviewTooltip.style.height = `${rect.height * 3}px`;

            imagePreviewTooltip.innerHTML = `<img src="${imgElement.src}" alt="Preview">`;
            imagePreviewTooltip.style.display = 'block';
        }
    });

    container.addEventListener('mousemove', (event) => {
        if (imagePreviewTooltip.style.display === 'block') {
            positionTooltip(event as MouseEvent);
        }
    });

    container.addEventListener('mouseout', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
            imagePreviewTooltip.style.display = 'none';
            imagePreviewTooltip.innerHTML = '';
        }
    });
}

/**
 * Creates the inner HTML for a result card with metadata.
 */
function createSuccessfulCardInnerHTML(fileData: ImageFile, metadata: MetadataResponse): string {
    const translations = TRANSLATIONS[currentUiLanguage];
    const copyIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4.5H4.5V18H16V4.5Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 1.5H19.5V15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const regenerateIconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 4.5V9.5H16.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.35 15.03C18.67 17.63 16.54 19.5 13.5 19.5C9.91 19.5 7 16.59 7 13C7 9.41 9.91 6.5 13.5 6.5C15.22 6.5 16.77 7.2 17.91 8.28L21.5 4.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const keywordTags = metadata.keywords.split(',')
        .map(k => k.trim())
        .filter(Boolean)
        .map(k => `<span class="keyword-tag">${k}</span>`)
        .join('');

    return `
      <div class="result-card-header">
          <img src="${fileData.previewUrl}" alt="${fileData.file.name}">
          <div class="status"><p><strong>${fileData.file.name}</strong></p><p>${translations.completed}</p></div>
      </div>
      <div class="result-item">
          <div class="result-header">
            <h2 class="result-title">${translations.title}</h2>
            <button class="copy-button" aria-label="${translations.copyTitleAria}">${copyIconSVG}</button>
          </div>
          <p class="title-output">${metadata.title}</p>
      </div>
      <div class="result-item">
          <h2 class="result-title">${translations.category}</h2>
          <p class="category-output">${metadata.category}</p>
      </div>
      <div class="result-item">
          <div class="result-header">
              <h2 class="result-title">${translations.keywords}</h2>
              <button class="copy-button" aria-label="${translations.copyKeywordsAria}">${copyIconSVG}</button>
          </div>
          <div class="keywords-output">${keywordTags}</div>
      </div>
      <div class="result-item regenerate-section">
          <label for="keyword-${fileData.id}" class="regenerate-label">${translations.regenerateLabel}</label>
          <div class="regenerate-controls">
              <input type="text" id="keyword-${fileData.id}" class="keyword-input" placeholder="${translations.regeneratePlaceholder}">
              <button class="regenerate-btn" data-id="${fileData.id}" aria-label="${translations.regenerateButtonAria}">${regenerateIconSVG}</button>
          </div>
      </div>
    `;
}

/**
 * Populates a result card element with metadata.
 */
function populateSuccessfulCard(resultCard: HTMLElement, fileData: ImageFile, metadata: MetadataResponse) {
    resultCard.innerHTML = createSuccessfulCardInnerHTML(fileData, metadata);
    resultCard.classList.remove('processing');

    const titleP = resultCard.querySelector('.title-output') as HTMLElement;
    const copyButtons = resultCard.querySelectorAll('.copy-button');
    setupCopyButton(copyButtons[0] as HTMLButtonElement, titleP);
    setupCopyButton(copyButtons[1] as HTMLButtonElement, metadata.keywords);
}

// --- Event Listeners ---

clearAllButton.addEventListener('click', () => resetUI(true));

previewsContainer.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('remove-btn')) {
        const idToRemove = target.dataset.id;
        if (idToRemove && uploadedFiles.has(idToRemove)) {
            const fileData = uploadedFiles.get(idToRemove);
            if(fileData) URL.revokeObjectURL(fileData.previewUrl);
            uploadedFiles.delete(idToRemove);
            renderPreviews();
        }
    } else if (target.tagName === 'IMG') {
        const imgElement = target as HTMLImageElement;
        openModal(imgElement.src, imgElement.alt);
    }
});

imageUpload.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    errorMessage.textContent = '';
    resultsList.style.display = 'none';
    if (resultsPlaceholder) {
        resultsPlaceholder.style.display = 'flex';
        const placeholderText = resultsPlaceholder.querySelector('p');
        if(placeholderText) placeholderText.textContent = TRANSLATIONS[currentUiLanguage].resultsPlaceholderReady;
    }

    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif', 'image/bmp'];

    for (const file of files) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) continue;
        const id = `${file.name}-${file.lastModified}-${file.size}`;
        if (uploadedFiles.has(id)) continue;

        try {
            const generativePart = await fileToGenerativePart(file);
            const previewUrl = URL.createObjectURL(file);
            uploadedFiles.set(id, { id, file, generativePart, previewUrl });
        } catch (error) {
            console.error('Error processing file:', file.name, error);
            errorMessage.textContent = `Error processing ${file.name}. It might be corrupted or an unsupported format.`;
        }
    }

    renderPreviews();
    target.value = '';
});

generateButton.addEventListener('click', async () => {
  if (uploadedFiles.size === 0) {
    errorMessage.textContent = 'Please upload at least one image.';
    return;
  }

  const translations = TRANSLATIONS[currentUiLanguage];
  errorMessage.textContent = '';
  resultsList.innerHTML = '';
  resultsList.style.display = 'block';
  if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
  
  let globalKeyword = globalKeywordInput.value;

  // Translate the global keyword if necessary before starting the generation loop.
  if (globalKeyword.trim() && currentUiLanguage !== currentMetadataLanguage) {
      generateButton.textContent = translations.translatingKeyword;
      generateButton.disabled = true; // Disable button during translation
      globalKeyword = await translateKeyword(globalKeyword);
  }

  generateButton.disabled = true;
  clearAllButton.disabled = true;
  imageUpload.disabled = true;
  uploadLabel.classList.add('disabled');

  const filesToProcess = Array.from(uploadedFiles.values());
  let processedCount = 0;

  for (const fileData of filesToProcess) {
    processedCount++;
    generateButton.textContent = translations.generatingStatus
        .replace('{processed}', processedCount.toString())
        .replace('{total}', filesToProcess.length.toString());

    const resultCard = document.createElement('div');
    resultCard.className = 'result-card processing';
    resultCard.id = `result-${fileData.id}`;
    resultCard.innerHTML = `
      <div class="result-card-header">
        <img src="${fileData.previewUrl}" alt="${fileData.file.name}">
        <div class="status">
          <p><strong>${fileData.file.name}</strong></p>
          <p>${translations.processing}</p>
        </div>
      </div>
    `;
    resultsList.appendChild(resultCard);
    resultsList.scrollTop = resultsList.scrollHeight;

    try {
      const prompt = createPrompt(currentMetadataLanguage, fileData.file.type, globalKeyword);
      const result: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ inlineData: fileData.generativePart }, { text: prompt }] },
        config: { responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
      });

      const responseText = result.text.trim();
      if (!responseText) throw new Error('Received an empty response from the API.');
      
      const metadata: MetadataResponse = JSON.parse(responseText);
      populateSuccessfulCard(resultCard, fileData, metadata);

    } catch (error: unknown) {
      console.error(`Error for ${fileData.file.name}:`, error);
      const detailedError = (error as Error)?.message || 'An unknown error occurred';
      
      resultCard.classList.remove('processing');
      resultCard.innerHTML = `
        <div class="result-card-header">
          <img src="${fileData.previewUrl}" alt="${fileData.file.name}">
          <div class="status error">
            <p><strong>${fileData.file.name}</strong></p>
            <p>${translations.errorStatus.replace('{error}', detailedError)}</p>
          </div>
        </div>
      `;
    }
  }

  generateButton.disabled = false;
  clearAllButton.disabled = false;
  imageUpload.disabled = false;
  uploadLabel.classList.remove('disabled');
  generateButton.textContent = translations.generateButton;
});

/**
 * Regenerates metadata for a specific image.
 */
async function regenerateMetadata(fileId: string, customKeyword: string) {
    const fileData = uploadedFiles.get(fileId);
    const resultCard = document.getElementById(`result-${fileId}`);

    if (!fileData || !resultCard) return;

    const translations = TRANSLATIONS[currentUiLanguage];
    resultCard.classList.add('processing');
    const statusElement = resultCard.querySelector('.result-card-header .status') as HTMLDivElement | null;
    
    const regenerateButton = resultCard.querySelector('.regenerate-btn') as HTMLButtonElement;
    if (regenerateButton) regenerateButton.disabled = true;

    try {
        let keywordToUse = customKeyword;
        // Translate the keyword if UI and metadata languages are different
        if (currentUiLanguage !== currentMetadataLanguage) {
            if (statusElement) {
                statusElement.innerHTML = `<p><strong>${fileData.file.name}</strong></p><p>${translations.translatingStatus}</p>`;
            }
            keywordToUse = await translateKeyword(customKeyword);
        }

        if (statusElement) {
            statusElement.innerHTML = `<p><strong>${fileData.file.name}</strong></p><p>${translations.regenerating}</p>`;
        }

        const regenerationPrompt = createPrompt(currentMetadataLanguage, fileData.file.type, keywordToUse);
        
        const result: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ inlineData: fileData.generativePart }, { text: regenerationPrompt }] },
            config: { responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
        });

        const responseText = result.text.trim();
        if (!responseText) throw new Error('Received an empty response from the API.');
        
        const metadata: MetadataResponse = JSON.parse(responseText);

        const keywordInput = resultCard.querySelector('.keyword-input') as HTMLInputElement | null;
        const currentKeyword = keywordInput?.value;

        populateSuccessfulCard(resultCard, fileData, metadata);
        
        const newKeywordInput = resultCard.querySelector('.keyword-input') as HTMLInputElement | null;
        if (newKeywordInput && currentKeyword) {
            newKeywordInput.value = currentKeyword;
        }

    } catch (error: unknown) {
        console.error(`Regeneration error for ${fileData.file.name}:`, error);
        const detailedError = (error as Error)?.message || 'An unknown error occurred';
        if (statusElement) {
            statusElement.classList.add('error');
            statusElement.innerHTML = `<p><strong>${fileData.file.name}</strong></p><p>${translations.errorStatus.replace('{error}', detailedError)}</p>`;
        }
        resultCard.classList.remove('processing');
    } finally {
        if (regenerateButton) regenerateButton.disabled = false;
    }
}


resultsList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'IMG') {
        openModal((target as HTMLImageElement).src, (target as HTMLImageElement).alt);
        return;
    }

    const regenerateButton = target.closest('.regenerate-btn');
    if (regenerateButton) {
        const fileId = (regenerateButton as HTMLButtonElement).dataset.id;
        if (!fileId) return;

        const resultCard = document.getElementById(`result-${fileId}`);
        const keywordInput = resultCard?.querySelector('.keyword-input') as HTMLInputElement | null;

        if (!resultCard || !keywordInput) return;

        const customKeyword = keywordInput.value.trim();
        const translations = TRANSLATIONS[currentUiLanguage];

        if (!customKeyword) {
            keywordInput.style.borderColor = 'var(--dark-error)';
            keywordInput.placeholder = translations.keywordRequired;
            setTimeout(() => {
                keywordInput.style.borderColor = '';
                keywordInput.placeholder = translations.regeneratePlaceholder;
            }, 2500);
            return;
        }

        await regenerateMetadata(fileId, customKeyword);
    }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
});

// --- Initialization ---

/**
 * Populates a select element with language options.
 * @param selectElement The <select> element to populate.
 */
function populateLanguageSelector(selectElement: HTMLSelectElement) {
    Object.keys(LANGUAGES).forEach(langCode => {
        const option = document.createElement('option');
        option.value = langCode;
        option.textContent = LANGUAGES[langCode];
        selectElement.appendChild(option);
    });
}

// Populate both language selectors
populateLanguageSelector(languageSelector);
populateLanguageSelector(metadataLanguageSelector);


// Set up event listeners for language changes
languageSelector.addEventListener('change', () => {
    setUiLanguage(languageSelector.value);
});

metadataLanguageSelector.addEventListener('change', () => {
    setMetadataLanguage(metadataLanguageSelector.value);
});

// Set initial languages from storage or defaults
const savedUiLang = localStorage.getItem('uiLanguage') || 'en';
setUiLanguage(savedUiLang);

const savedMetadataLang = localStorage.getItem('metadataLanguage') || 'en';
setMetadataLanguage(savedMetadataLang);


setupImageHoverPreview(previewsContainer);
setupImageHoverPreview(resultsList);