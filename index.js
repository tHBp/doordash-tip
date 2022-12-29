function createContainerWithTip(container, tip, config = {}) {
    const clonedContainer = container.cloneNode(true);
    const recommendedTipNodeLabel = document.evaluate("//span[text()='Subtotal']", clonedContainer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    recommendedTipNodeLabel.innerText = `Tip @${tip}%`;
    const [, recommendedTipNodeDollarValue] = clonedContainer.querySelectorAll('span[color="TextPrimary"]');
    const subtotalValue = Number(recommendedTipNodeDollarValue.innerText.substring(1));
    const tipPercent = (tip / 100 * subtotalValue).toPrecision(config.precision || 3);
    recommendedTipNodeDollarValue.innerText = `$${tipPercent}`;

    // Styling
    const colorStyle = `color: ${config.textColor || '#00838a'}`;
    recommendedTipNodeLabel.style = colorStyle;
    recommendedTipNodeDollarValue.style = colorStyle;

    // Return the cloned container back
    return clonedContainer;
}


const container = document.querySelector("div[data-testid='Subtotal']").parentElement;
const color = 'green';

const pc15 = createContainerWithTip(container, 15, { textColor: color });
const pc18 = createContainerWithTip(container, 18, { textColor: color });
const pc20 = createContainerWithTip(container, 20, { textColor: color });

// Open other tip picker
Array.from(document.querySelectorAll('button[data-anchor-id="TipPickerOption"]')).pop().click();

container.parentElement.insertBefore(pc20, container.parentElement.children[1]);
container.parentElement.insertBefore(pc18, container.parentElement.children[1]);
container.parentElement.insertBefore(pc15, container.parentElement.children[1]);