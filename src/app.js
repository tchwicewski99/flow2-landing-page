// lottie-files player
import '@lottiefiles/lottie-player';

document.addEventListener('DOMContentLoaded', () => {

    // --- ENGLISH COMMENT: KEY DATA STRUCTURES ---
    // This is the main configuration for the multi-step form.
    const steps = [
        { type: 'context', title: 'Odkryj ukryte koszty w Twojej firmie', description: 'Chcesz zobaczyć, ile pieniędzy ucieka Ci przez palce każdego dnia? Odpowiedz na 4 krótkie pytania, aby poznać prawdę.' },
        { type: 'diagnosis', title: 'Gdzie tracicie najwięcej czasu?', description: 'Oszacuj, ile godzin w tygodniu Twój zespół marnuje na powtarzalne zadania. Bądź szczery – wynik może Cię zaskoczyć!' },
        { type: 'valuation', title: 'Przeliczmy czas na pieniądze', description: 'Jaki jest średni koszt godziny pracy w Twoim zespole? To ostatni krok, by zobaczyć, ile naprawdę kosztuje Cię nieefektywność.' },
        { type: 'summary', title: 'Twoja Diagnoza Potencjału', description: 'Na podstawie Twoich odpowiedzi oszacowaliśmy realny koszt nieefektywności w firmie.' }
    ];

    // --- ENGLISH COMMENT: INDUSTRY-SPECIFIC QUESTIONS ---
    // You can easily add or edit tasks here.
    const industrySpecificTasks = {
        'ecommerce': [ { id: 'task1', label: 'Ręczne przepisywanie danych z zamówień' }, { id: 'task2', label: 'Ręczne generowanie raportów sprzedaży' }, { id: 'task3', label: 'Odpowiadanie na powtarzalne zapytania' } ],
        'it': [ { id: 'task1', label: 'Ręczne tworzenie i przydzielanie zadań' }, { id: 'task2', label: 'Manualne testowanie i wdrażanie zmian' }, { id: 'task3', label: 'Generowanie raportów z postępu projektów' } ],
        'marketing': [ { id: 'task1', label: 'Ręczne kopiowanie danych do kampanii' }, { id: 'task2', label: 'Agregowanie danych do raportów marketingowych' }, { id: 'task3', label: 'Zarządzanie i publikacja treści w mediach' } ],
        'law': [ { id: 'task1', label: 'Przygotowywanie standardowych umów' }, { id: 'task2', label: 'Wyszukiwanie i kompilowanie danych' }, { id: 'task3', label: 'Zarządzanie i przypominanie o terminach' } ],
        'finance': [ { id: 'task1', label: 'Ręczne wprowadzanie faktur i płatności' }, { id: 'task2', label: 'Uzgadnianie wyciągów bankowych' }, { id: 'task3', label: 'Przygotowywanie cyklicznych raportów finansowych' } ],
        'logistics': [ { id: 'task1', label: 'Manualne śledzenie i aktualizacja statusów przesyłek' }, { id: 'task2', label: 'Zarządzanie i awizacja dostaw' }, { id: 'task3', label: 'Generowanie dokumentacji transportowej' } ],
        'other': [ { id: 'task1', label: 'Powtarzalne zadania administracyjne' }, { id: 'task2', label: 'Ręczne tworzenie raportów i zestawień' }, { id: 'task3', label: 'Obsługa wewnętrznych zapytań i procesów' } ]
    };

    // --- STATE MANAGEMENT & DOM ELEMENTS ---
    let currentStep = 0;
    const userSelections = {};
    const dialog = document.getElementById('dialog');
    const openDialogButton = document.querySelector('button[commandfor="dialog"]');
    const dialogPanel = dialog.querySelector('el-dialog-panel');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogDescription = document.getElementById('dialog-description');
    const stepContent = document.getElementById('step-content');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const navButtonsContainer = document.getElementById('navigation-buttons');
    const progressNav = document.getElementById('progress-nav');

    // --- ANIMATION & NAVIGATION ---
    function transitionToStep(targetStep) {
        dialogPanel.classList.add('animate-fade-out');
        setTimeout(() => {
            currentStep = targetStep;
            renderStep(currentStep);
            dialogPanel.classList.remove('animate-fade-out');
            dialogPanel.classList.add('animate-fade-in');
            setTimeout(() => { dialogPanel.classList.remove('animate-fade-in'); }, 300);
        }, 200);
    }

    function handleNextClick() {
        const stepData = steps[currentStep];
        if (stepData.type === 'context') {
            const selectedIndustry = stepContent.querySelector('input[name="industry"]:checked');
            const selectedSize = stepContent.querySelector('input[name="company-size"]:checked');
            if (!selectedIndustry || !selectedSize) {
                alert('Proszę wybrać branżę i wielkość firmy.');
                return;
            }
            userSelections.industry = selectedIndustry.value;
            userSelections.companySize = selectedSize.value;
        } else if (stepData.type === 'diagnosis' || stepData.type === 'valuation') {
            saveSliderValues();
        }
        if (currentStep < steps.length - 1) transitionToStep(currentStep + 1);
    }

    function handleBackClick() {
        if (currentStep > 0) transitionToStep(currentStep - 1);
    }
    
    function handleFormSubmit() {
        // --- ENGLISH COMMENT: NEW FORM FIELDS VALIDATION ---
        const nameInput = document.getElementById('name');
        const companyInput = document.getElementById('company');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const consentCheckbox = document.getElementById('consent');

        let isValid = true;
        const inputs = [nameInput, companyInput, phoneInput, emailInput];

        inputs.forEach(input => {
            if (!input.value || (input.type === 'email' && !input.checkValidity())) {
                isValid = false;
                input.classList.add('ring-2','ring-red-500');
            } else {
                input.classList.remove('ring-2','ring-red-500');
            }
        });

        if (!consentCheckbox.checked) {
            isValid = false;
            consentCheckbox.closest('.relative').querySelector('label').classList.add('text-red-600');
        } else {
            consentCheckbox.closest('.relative').querySelector('label').classList.remove('text-red-600');
        }

        if (isValid) {
            userSelections.name = nameInput.value;
            userSelections.company = companyInput.value;
            userSelections.phone = phoneInput.value;
            userSelections.email = emailInput.value;
            userSelections.consent = consentCheckbox.checked;

            console.log('Final Selections (Lead Captured):', userSelections);
            
            dialogTitle.textContent = "Potwierdzenie";
            dialogDescription.textContent = "Wiadomość została wysłana."
            stepContent.innerHTML = `<div class="text-center py-10"><h3 class="text-xl font-semibold text-green-600">Dziękujemy!</h3><p class="mt-2 text-gray-600">Twój spersonalizowany Plan Odzyskiwania Potencjału został wysłany na adres ${userSelections.email}.</p></div>`;
            navButtonsContainer.style.display = 'none';
            progressNav.style.display = 'none';
        }
    }
    
    function saveSliderValues() {
        stepContent.querySelectorAll('input[type="range"]').forEach(slider => {
            userSelections[slider.id] = parseInt(slider.value, 10);
        });
    }

    // --- RENDERING FUNCTIONS ---
    function updateProgressIndicator() {
        if (!progressNav) return;
        progressNav.style.display = 'flex';
        const progressList = progressNav.querySelector('ol');
        progressList.innerHTML = ''; 
        const totalProgressSteps = steps.length;
        for (let i = 0; i < totalProgressSteps; i++) {
            const li = document.createElement('li');
            let linkContent = '';
            if (i < currentStep) {
                linkContent = `<a href="#" class="block size-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"><span class="sr-only">Step ${i+1}</span></a>`;
            } else if (i === currentStep) {
                linkContent = `<a href="#" aria-current="step" class="relative flex items-center justify-center"><span aria-hidden="true" class="absolute flex size-5 p-px"><span class="size-full rounded-full bg-indigo-200"></span></span><span aria-hidden="true" class="relative block size-2.5 rounded-full bg-indigo-600"></span><span class="sr-only">Step ${i+1}</span></a>`;
            } else {
                linkContent = `<a href="#" class="block size-2.5 rounded-full bg-gray-200 hover:bg-gray-400"><span class="sr-only">Step ${i+1}</span></a>`;
            }
            li.innerHTML = linkContent;
            progressList.appendChild(li);
        }
    }

    function renderStep(stepIndex) {
        const stepData = steps[stepIndex];
        if (!stepData) return;
        updateProgressIndicator();

        if (stepData.type !== 'summary') {
            dialogTitle.textContent = stepData.title;
            dialogDescription.textContent = stepData.description;
        }
        
        stepContent.innerHTML = '';
        backButton.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
        navButtonsContainer.style.display = 'grid';
        
        switch (stepData.type) {
            case 'context': renderContextStep(); break;
            case 'diagnosis': renderDiagnosisStep(); break;
            case 'valuation': renderValuationStep(); break;
            case 'summary': renderSummaryStep(); break;
        }
    }

    function renderContextStep() {
        const industries = [
            { value: 'ecommerce', title: 'E-commerce', description: 'Zamówienia i obsługa', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />`},
            { value: 'it', title: 'IT i software', description: 'Workflow i projekty', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />` },
            { value: 'marketing', title: 'Marketing i Media', description: 'Kampanie i raporty', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />` },
            { value: 'law', title: 'Prawo i Doradztwo', description: 'Umowy i dokumentacja', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />` },
            { value: 'finance', title: 'Finanse i Księgowość', description: 'Faktury i kontrola', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />` },
            { value: 'logistics', title: 'Logistyka i Produkcja', description: 'Łańcuch dostaw', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />` },
            { value: 'other', title: 'Inna branża', description: 'Dedykowane rozwiązania', icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />` },
        ];
        const companySizes = [ { value: '1-5', label: '1-5'}, { value: '6-15', label: '6-15'}, { value: '16-50', label: '16-50'}, { value: '50+', label: '50+'} ];
        let industryHtml = '<h3 class="text-sm font-semibold text-gray-800 mb-2">Wybierz branżę:</h3><div class="space-y-2">';
        industries.forEach(ind => {
            industryHtml += `<div><input type="radio" name="industry" value="${ind.value}" id="ind-${ind.value}" class="sr-only"><label for="ind-${ind.value}" class="industry-label flex items-center p-3 rounded-md border border-gray-200 cursor-pointer transition-colors duration-150 hover:bg-indigo-50"><div class="icon-container flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-150"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">${ind.icon}</svg></div><div class="ml-4 text-left"><p class="title-text font-semibold text-sm text-gray-900 transition-colors duration-150">${ind.title}</p><p class="description-text text-xs text-gray-500 transition-colors duration-150">${ind.description}</p></div></label></div>`;
        });
        industryHtml += '</div>';
        let sizeHtml = '<h3 class="text-sm font-semibold text-gray-800 mt-6 mb-2">Liczba pracowników:</h3><div class="grid grid-cols-4 gap-2">';
        companySizes.forEach(size => {
            sizeHtml += `<div><input type="radio" name="company-size" value="${size.value}" id="size-${size.value}" class="sr-only"><label for="size-${size.value}" class="size-label block w-full text-center text-sm p-3 rounded-md border border-gray-200 cursor-pointer transition-colors duration-150 hover:bg-indigo-50">${size.label}</label></div>`;
        });
        sizeHtml += '</div>';
        stepContent.innerHTML = industryHtml + sizeHtml;
        nextButton.textContent = 'Dalej';
        stepContent.querySelectorAll('input[name="industry"]').forEach(radio => {
            radio.addEventListener('change', () => {
                stepContent.querySelectorAll('.industry-label').forEach(label => label.classList.remove('selected'));
                if (radio.checked) radio.nextElementSibling.classList.add('selected');
            });
        });
        stepContent.querySelectorAll('input[name="company-size"]').forEach(radio => {
            radio.addEventListener('change', () => {
                stepContent.querySelectorAll('.size-label').forEach(label => label.classList.remove('selected'));
                if (radio.checked) radio.nextElementSibling.classList.add('selected');
            });
        });
    }

    function renderDiagnosisStep() {
        const tasks = industrySpecificTasks[userSelections.industry] || industrySpecificTasks['other'];
        let slidersHtml = '<div class="space-y-8 pt-4">';
        tasks.forEach(task => {
            const savedValue = userSelections[task.id] || 5;
            slidersHtml += `<div><label for="${task.id}" class="flex justify-between items-center text-sm font-medium text-gray-700"><span>${task.label}</span><span id="${task.id}-value" class="font-bold text-indigo-600 text-base">${savedValue} godz.</span></label><input type="range" id="${task.id}" name="${task.id}" min="0" max="40" step="1" value="${savedValue}" class="mt-2"></div>`;
        });
        slidersHtml += '</div>';
        stepContent.innerHTML = slidersHtml;
        stepContent.querySelectorAll('input[type="range"]').forEach(slider => {
            const valueSpan = document.getElementById(`${slider.id}-value`);
            slider.addEventListener('input', () => { valueSpan.textContent = `${slider.value} godz.`; });
        });
        nextButton.textContent = 'Dalej';
    }

    function renderValuationStep() {
        const savedValue = userSelections.hourlyRate || 80;
        stepContent.innerHTML = `<div class="space-y-8 pt-4"><div><label for="hourlyRate" class="flex justify-between items-center text-sm font-medium text-gray-700"><span>Średni koszt roboczogodziny</span><span id="hourlyRate-value" class="font-bold text-indigo-600 text-base">${savedValue} PLN</span></label><input type="range" id="hourlyRate" name="hourlyRate" min="30" max="250" step="5" value="${savedValue}" class="mt-2"></div></div>`;
        const slider = document.getElementById('hourlyRate');
        const valueSpan = document.getElementById('hourlyRate-value');
        slider.addEventListener('input', () => { valueSpan.textContent = `${slider.value} PLN`; });
        nextButton.textContent = 'Zobacz Diagnozę';
    }
    
    function renderSummaryStep() {
        // --- ENGLISH COMMENT: CALCULATION LOGIC ---
        const tasks = industrySpecificTasks[userSelections.industry] || industrySpecificTasks['other'];
        const totalHoursPerWeek = tasks.reduce((sum, task) => sum + (userSelections[task.id] || 0), 0);
        const hourlyRate = userSelections.hourlyRate || 80;
        const yearlyCost = totalHoursPerWeek * hourlyRate * 52;
        const yearlyHours = totalHoursPerWeek * 52;

        dialogTitle.textContent = `Odzyskaj ${yearlyCost.toLocaleString('pl-PL')} zł. Pokażemy Ci jak.`;
        dialogDescription.innerHTML = '&nbsp;'; 

        let contextHtml = '';
        if (totalHoursPerWeek > 0 && totalHoursPerWeek <= 5) {
            contextHtml = `<p class="mt-4 text-center text-gray-600">Nawet kilka straconych godzin w tygodniu sumuje się w <strong>${yearlyHours.toLocaleString('pl-PL')} godzin rocznie</strong>. To tak, jakby co miesiąc jeden pracownik brał dodatkowy, płatny dzień wolny. Te pieniądze mogą zostać w Twojej firmie.</p>`;
        } else if (totalHoursPerWeek >= 6 && totalHoursPerWeek <= 15) {
            contextHtml = `
                <div class="mt-6 text-left space-y-4 text-gray-600">
                    <p>Ta kwota to efekt <strong>${yearlyHours.toLocaleString('pl-PL')} godzin</strong> straconych rocznie. W Twojej firmie:</p>
                    <ul class="space-y-3">
                        <li class="flex items-start"><span class="text-xl mr-3">👤</span><span>Jeden ze specjalistów pracuje przez kilka miesięcy za darmo.</span></li>
                        <li class="flex items-start"><span class="text-xl mr-3">💸</span><span>Tracisz budżet, który mógłby pracować na rozwój.</span></li>
                    </ul>
                </div>
            `;
        } else if (totalHoursPerWeek > 15) {
            contextHtml = `<p class="mt-4 text-center text-gray-600">Co tydzień z Twojej firmy "wyparowują" ponad dwa dni robocze. To tak, jakbyś zatrudniał pracownika-widmo, któremu płacisz pensję za marnowanie czasu. Te <strong>${yearlyCost.toLocaleString('pl-PL')} zł</strong> mogłyby sfinansować nowy etat lub potężną kampanię marketingową.</p>`;
        }

        const summaryHtml = `
            <div class="text-center mt-2">
                <p class="text-base font-medium text-gray-800">Twój roczny koszt nieefektywności to:</p>
                <p class="text-5xl font-bold tracking-tight text-red-600 my-2">${yearlyCost.toLocaleString('pl-PL')} PLN</p>
                ${contextHtml}
            </div>

            <div class="mt-8 space-y-6">
                <div class="text-center">
                    <p class="text-sm font-semibold leading-6 text-gray-900">To nie wyrok. To szansa.</p>
                    <p class="mt-1 text-sm text-gray-600">Odbierz bezpłatny Plan Działania i dowiedz się, jak w 3 prostych krokach odzyskać ten potencjał.</p>
                </div>
            
                <div class="space-y-5">
                    <div class="relative floating-label-container">
                        <input type="text" name="name" id="name" class="floating-label-input peer" placeholder="Imię" required>
                        <label for="name" class="floating-label">Imię</label>
                    </div>
                    <div class="relative floating-label-container">
                        <input type="text" name="company" id="company" class="floating-label-input peer" placeholder="Firma" required>
                        <label for="company" class="floating-label">Firma</label>
                    </div>
                    <div class="relative floating-label-container">
                        <input type="tel" name="phone" id="phone" class="floating-label-input peer" placeholder="Numer telefonu" required>
                        <label for="phone" class="floating-label">Numer telefonu</label>
                    </div>
                    <div class="relative floating-label-container">
                        <input type="email" name="email" id="email" class="floating-label-input peer" placeholder="Email" required>
                        <label for="email" class="floating-label">Email</label>
                    </div>
                </div>

                <p class="text-xs mt-5 text-gray-500">
                    Wysyłając formularz, oświadczasz, że zapoznałeś(-aś) się z naszą Polityką Prywatności. Administratorem Twoich danych jest Tomasz Chwicewski, NIP 5423447478. Przetwarzamy Twoje dane w celu odpowiedzi na zapytanie.
                </p>
            </div>
        `;
        stepContent.innerHTML = summaryHtml;
        nextButton.textContent = 'Wyślij mi Plan Działania';
    }

    function resetDialog() {
        currentStep = 0;
        Object.keys(userSelections).forEach(key => delete userSelections[key]);
        if(dialog.open) renderStep(0);
        nextButton.disabled = false;
        backButton.style.display = 'inline-flex';
    }

    // --- INITIAL SETUP ---
    backButton.addEventListener('click', handleBackClick);
    nextButton.addEventListener('click', handleNextClick);
    openDialogButton.addEventListener('click', () => {
        resetDialog();
        renderStep(0);
    });
    dialog.addEventListener('open', resetDialog);
});