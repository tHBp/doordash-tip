const PrimaryElementSelector = 'span[color="TextPrimary"]';
const SubTotalElementSelector = "div[data-testid='Subtotal']";
const CustomTipInputSelector = 'input[data-testid="OtherTipInput"]';
const DasherTipTextSelector = "div[data-testid='Dasher Tip']";
const CustomTipPickerOptionSelector = 'button[data-anchor-id="TipPickerOption"]';


function waitFor(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function createContainerWithTip(container, subtotalValue, tip, config = {}) {
    const clonedContainer = container.cloneNode(true);
    const recommendedTipNodeLabel = document.evaluate("//span[text()='Subtotal']", clonedContainer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    recommendedTipNodeLabel.innerText = `Tip @${tip}%`;
    const [, recommendedTipNodeDollarValue] = clonedContainer.querySelectorAll(PrimaryElementSelector);
    
    const tipValue = (tip / 100 * subtotalValue).toPrecision(config.precision || 3);
    recommendedTipNodeDollarValue.innerText = `$${tipValue}`;

    // Styling
    const colorStyle = `color: ${config.textColor || '#00838a'}`;
    recommendedTipNodeLabel.style = colorStyle;
    recommendedTipNodeDollarValue.style = colorStyle;

    // Return the cloned container back
    return clonedContainer;
}

async function updateCustomTip(tipValue) {
    // Open other tip picker
    Array.from(document.querySelectorAll(CustomTipPickerOptionSelector)).pop().click();
    // Wait for element to be available in DOM
    const CustomInputElement = await waitFor(CustomTipInputSelector);

    // TODO: Revisit how to update the tip correctly
    /**
     * CustomInputElement.setAttribute('style', 'visibility: hidden;');
     * setTimeout(() => {
     * CustomInputElement.removeAttribute('style');
     * CustomInputElement.value = tipValue;
     * const onInputEvent = new Event('input');
     * CustomInputElement.dispatchEvent(onInputEvent);
     * }, 2000);
    **/

    CustomInputElement.addEventListener('change', customTipChangeHandler);
}

async function customTipChangeHandler(event) {
    const { target: { value: tipValue } } = event;
    const DasherTipElement = await waitFor(DasherTipTextSelector);
    const [, DasherTipTextValueElement] = DasherTipElement.querySelectorAll(PrimaryElementSelector);
    if (DasherTipTextValueElement.innerText.includes('%')) return;
    const subtotalValue = await getSubtotal();
    const tipPercent = ((Number(tipValue) / subtotalValue) * 100).toPrecision(3);
    DasherTipTextValueElement.innerText = `${DasherTipTextValueElement.innerText} (${tipPercent}%)`;
}

async function getSubtotal() {
    const containerElement = await waitFor(SubTotalElementSelector);
    const [, SubTotalValueElement] = containerElement.querySelectorAll(PrimaryElementSelector);
    return Number(SubTotalValueElement.innerText.substring(1));
}


(async () => {
    const containerElement = await waitFor(SubTotalElementSelector);
    const container = containerElement.parentElement;
    const color = 'green';

    const subtotalValue = await getSubtotal();

    const pc15 = createContainerWithTip(container, subtotalValue, 15, { textColor: color });
    const pc18 = createContainerWithTip(container, subtotalValue, 18, { textColor: color });
    const pc20 = createContainerWithTip(container, subtotalValue, 20, { textColor: color });

    container.parentElement.insertBefore(pc20, container.parentElement.children[1]);
    container.parentElement.insertBefore(pc18, container.parentElement.children[1]);
    container.parentElement.insertBefore(pc15, container.parentElement.children[1]);

    const pc18Tip = (18 * subtotalValue / 100).toPrecision(3);
    await updateCustomTip(pc18Tip);
})();