class Hash
  def dig(key, *rest)
    value = self[key]
    if value.nil? || rest.empty?
      value
    elsif value.respond_to?(:dig)
      value.dig(*rest)
    else
      fail TypeError, "#{value.class} does not have #dig method"
    end
  end
end
